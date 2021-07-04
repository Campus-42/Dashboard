import { Button, Modal, Spinner } from "reactstrap";
import { FC, useState } from "react";
import { PermLevel, UserInfo } from "../../interfaces/UserInfo";
import { getEnumKeyByEnumValue } from "../../utils";

interface IProps {
  show: boolean;
  onSubmit: ({
    userInfo,
    permLevel,
  }: {
    userInfo: UserInfo;
    permLevel: PermLevel;
  }) => Promise<boolean>;
  onClose: Function;
  userInfo: UserInfo;
}

const SetPermissionsModal: FC<IProps> = ({
  show,
  onSubmit,
  onClose,
  userInfo,
}) => {
  const options = Object.values(PermLevel);

  const [selected, setSelected] = useState<PermLevel>(
    userInfo.perm_level || PermLevel.Member
  );

  const [isSubmitting, setSubmitting] = useState(false);

  async function submitForm() {
    setSubmitting(true);
    let result = await onSubmit({
      userInfo,
      permLevel: selected,
    });

    if (!result) setSubmitting(false);
  }

  return (
    <Modal
      className="modal-dialog-centered"
      isOpen={show}
      toggle={(e: any) => onClose(e)}
    >
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">
          Modal title
        </h5>
        <button
          aria-label="Close"
          className="close"
          data-dismiss="modal"
          type="button"
          onClick={(e) => onClose(e)}
        >
          <span aria-hidden={true}>×</span>
        </button>
      </div>
      <div className="modal-body">
        {options.map((option) => (
          <div className="custom-control custom-radio mb-3" key={option}>
            <input
              className="custom-control-input"
              id={"permissions-radio-" + option}
              name="permissions-radio"
              type="radio"
              checked={selected === option}
              onChange={(e) => setSelected(option)}
            />
            <label
              className="custom-control-label"
              htmlFor={"permissions-radio-" + option}
            >
              {getEnumKeyByEnumValue(PermLevel, option)}
            </label>
          </div>
        ))}
      </div>
      <div className="modal-footer">
        <Button
          color="secondary"
          data-dismiss="modal"
          type="button"
          onClick={(e) => onClose(e)}
        >
          Cancel
        </Button>
        {!isSubmitting ? (
          <Button color="primary" type="button" onClick={submitForm}>
            Save changes
          </Button>
        ) : (
          <Button
            color="primary"
            type="button"
            onClick={submitForm}
            disabled={true}
          >
            <Spinner color="light" />
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default SetPermissionsModal;
