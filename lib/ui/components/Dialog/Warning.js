import PropTypes from 'prop-types';
import Button from '../Button';
import Dialog from './Dialog';

/*
 * Designed to present warnings to the user. Unlike some other Dialog types user
 * must explicitly click Acknowledge to close.
 */
const Warning = ({
  title,
  message,
  canCancel = true,
  onConfirm,
  onCancel,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  show = false,
}) => (
  <Dialog
    type="warning"
    icon="warning"
    show={show}
    title={title}
    message={message}
    options={[
      canCancel ? (
        <Button
          key="cancel"
          onClick={() => onCancel?.()}
          color="navy-taupe"
          content={cancelLabel}
        />
      ) : null,
      <Button
        key="confirm"
        onClick={onConfirm}
        color="mustard"
        content={confirmLabel}
      />,
    ]}
  />
);

Warning.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.node,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  canCancel: PropTypes.bool,
  show: PropTypes.bool,
};

export default Warning;
