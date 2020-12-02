import React from 'react';
import {bool, func} from 'prop-types';

import './ModalSchedule.scss';
import {useTranslation} from 'react-i18next';

const ModalZero = ({handleClose, show}) => {
  const {t} = useTranslation();

  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  return (
    <div
      aria-label="schedule_modal_empty_edit_chosen_field"
      className={`${showHideClassName} modal `}
    >
      <section className="modal-form modal-main schedule-modal__noday">
        <p
          aria-label="schedule_modal_empty_number_zero"
          className={`schedule-modal__title `}
        >
          {t('You have chosen')} {'0'} {t('days')}
        </p>
        <p className={`schedule-modal__title `}>{t('You have to choose')}</p>
        <p className={`schedule-modal__title `}>{t('some days')}</p>
        <button
          aria-label="schedule_modal_empty_edit_close_button"
          className="button modal__button--submit"
          type="button"
          onClick={handleClose}
        >
          {t('Close')}
        </button>
      </section>
    </div>
  );
};

ModalZero.propTypes = {
  handleClose: func,
  show: bool,
};

export default ModalZero;
