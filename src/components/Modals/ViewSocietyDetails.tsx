import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  Spinner,
} from "reactstrap";
import React, { FC, useState } from "react";
import { UserInfo } from "../../interfaces/UserInfo";
import { Society } from "../../interfaces/Society";

interface IProps {
  show: boolean;
  onSubmit: ({ society }: { society: Society }) => Promise<boolean>;
  onClose: Function;
  society: Society;
  users: UserInfo[];
}

const ViewSocietyDetails: FC<IProps> = ({
  show,
  onSubmit,
  onClose,
  society,
  users,
}) => {
  // const options = Object.values(PermLevel);
  //
  // const [selected, setSelected] = useState<PermLevel>(
  //   userInfo.perm_level || PermLevel.Member
  // );

  const [isSubmitting] = useState(false);

  async function submitForm() {
    // setSubmitting(true);
    // let new_members = execMembers.filter(
    //   (member) => !society.members.includes(member)
    // );
    // let result = await onSubmit({
    //   society: {
    //     ...society,
    //     members: [...society.members, ...new_members],
    //     exec_members: execMembers,
    //     exec_roles: execRoles,
    //   },
    // });
    //
    // if (!result) setSubmitting(false);
  }

  return (
    <Modal
      className="modal-dialog-centered"
      isOpen={show}
      toggle={(e: any) => onClose(e)}
    >
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">
          Society Details ({society.name})
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
        <Form>
          <FormGroup>
            <Label for="name">Name</Label>
            <Col>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                value={society.name}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Label for="name">Description</Label>
            <Col>
              <Input
                type="textarea"
                name="name"
                id="name"
                placeholder="Name"
                value={society.description}
                style={{
                  transition: "none",
                }}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Label for="name">Price:</Label>
            <Col>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                value={"£" + society.pricing?.value}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Label for="name">Posted by:</Label>
            <Col>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                value={(() => {
                  let user = users.find(
                    (user) => user._id === society.posted_by
                  );
                  if (!user) return "";
                  return `${user.first_name} ${user.last_name} (${user.email})`;
                })()}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Label for="name">Posted at:</Label>
            <Col>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                value={new Date(society.posted_date).toLocaleDateString()}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Label for="name">No. of members:</Label>
            <Col>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                value={society.members.length}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Label for="name">No. of members:</Label>
            <Col>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                value={society.exec_members.length}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Label for="name">Visible:</Label>
            <Col>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                value={society.visible.toString()}
              />
            </Col>
          </FormGroup>
        </Form>
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

export default ViewSocietyDetails;
