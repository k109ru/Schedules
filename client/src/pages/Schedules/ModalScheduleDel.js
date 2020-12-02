import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';
import {useMutation} from 'react-apollo';
import {DELETE_SCHEDULE} from '../../queries';
import {string, bool, func, any, object} from 'prop-types';

import {connect} from 'react-redux';
import {deletedSchedule} from '../../actions';
import getAdminEmail from '../../utils/getAdminEmail';
import Loader from '../../components/Loader';
import {useTranslation} from 'react-i18next';

const ModalScheduleDel = ({
  handleClose,
  show,
  children,
  id,
  name,
  deletedSchedule,
  // delSchedule,
}) => {
  const {t} = useTranslation();

  const [toSchedules, setToSchedules] = useState(false);

  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  const [
    deleteSchedule,
    {loading: mutationLoading, error: mutationError},
  ] = useMutation(DELETE_SCHEDULE);

  if (mutationLoading) {
    return Loader();
  }

  if (mutationError) {
    return <Redirect to="/mutation-error" />;
  }

  if (toSchedules) {
    return <Redirect to={`/schedules`} />;
  }

  return (
    <div
      aria-label="schedule_modal_delete_schedule"
      className={showHideClassName}
    >
      <section className="modal-main modal">
        <button
          aria-label="schedule_modal_delete_close_button"
          className="button modal__button--close"
          type="button"
          onClick={handleClose}
        >
          {t('Close')}
        </button>
        <div className="modal__ask">
          <p>{t('Do you realy want to delete')}</p>
          <p>
            {t('the schedule')}{' '}
            <span
              aria-label="schedule_modal_name_schedule"
              className="modal__important"
            >
              "{name}"
            </span>
            !?
          </p>
        </div>
        {children}
        <form
          className="modal-form"
          onSubmit={(e) => {
            e.preventDefault();
            deleteSchedule({
              variables: {
                id,
                email: getAdminEmail(),
              },
            });

            deletedSchedule([{id: id, name: name}]);
            setToSchedules(true);
          }}
        >
          <div className="modal__buttons">
            <button
              aria-label="schedule_modal_yes_button"
              className="button modal__button--submit"
              type="submit"
            >
              {' '}
              {t('Yes')}{' '}
            </button>
            <button
              aria-label="schedule_modal_no_button"
              className="button modal__button--submit"
              type="button"
              onClick={handleClose}
            >
              {' '}
              {t('No')}{' '}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    delSchedule: state.scheduleObj,
  };
};

ModalScheduleDel.propTypes = {
  handleClose: func,
  show: bool,
  children: any,
  id: string,
  employee: object,
  name: string,
  deletedSchedule: func,
};

export {ModalScheduleDel};

export default connect(mapStateToProps, {deletedSchedule})(ModalScheduleDel);
