import React from 'react';
import {string, bool, func, any, object} from 'prop-types';
import UpdateEmployee from './UpdateEmployee';
import {useTranslation} from 'react-i18next';

const ModalEditOfEmployee = ({handleClose, show, children, id, employee}) => {
  const {t} = useTranslation();

  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  if (employee.fullname) {
    return (
      <div
        aria-label="schedule_modal_edit_employee_window"
        className={showHideClassName}
      >
        <section className="modal-main modal">
          <button
            aria-label="schedule_modal_edit_employee_close_button"
            className="button modal__button--close"
            type="button"
            onClick={handleClose}
          >
            {t('Close')}
          </button>
          {children}
          <UpdateEmployee
            employee={employee}
            idSchedule={id}
            handleClose={handleClose}
          />
        </section>
      </div>
    );
  }

  return <div className={showHideClassName}>loading....</div>;
};

ModalEditOfEmployee.propTypes = {
  handleClose: func,
  show: bool,
  children: any,
  id: string,
  employee: object,
  fullname: string,
};

export default ModalEditOfEmployee;
