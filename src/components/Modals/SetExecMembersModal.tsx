import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Modal,
  Row,
  Spinner,
} from "reactstrap";
import React, { FC, useState } from "react";
import { PermLevel, UserInfo } from "../../interfaces/UserInfo";
import { getEnumKeyByEnumValue } from "../../utils";
import { Society } from "../../interfaces/Society";

interface IProps {
  show: boolean;
  onSubmit: ({ society }: { society: Society }) => Promise<boolean>;
  onClose: Function;
  society: Society;
  users: UserInfo[];
}

const SetExecMembersModal: FC<IProps> = ({
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
  const [execMembers, setExecMembers] = useState(society.exec_members);
  const [execRoles, setExecRoles] = useState(society.exec_roles);

  const [isSubmitting, setSubmitting] = useState(false);

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  async function submitForm() {
    setSubmitting(true);
    let new_members = execMembers.filter(
      (member) => !society.members.includes(member)
    );
    let result = await onSubmit({
      society: {
        ...society,
        members: [...society.members, ...new_members],
        exec_members: execMembers,
        exec_roles: execRoles,
      },
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
          Set Executive Members
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
        {execMembers.map((exec_id) => {
          let userInfo = users.find((user) => user._id === exec_id);
          if (!userInfo) return null;

          return (
            <FormGroup>
              <InputGroup className="mb-4">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fa fa-user" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Search"
                  type="text"
                  value={`${userInfo.first_name} ${userInfo.last_name} (${userInfo.email})`}
                  disabled
                />
                <InputGroupAddon
                  addonType="append"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setExecMembers(
                      execMembers.filter((id) => id !== userInfo!._id)
                    )
                  }
                >
                  <InputGroupText>
                    <i className="fa fa-trash-alt" style={{ color: "red" }} />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </FormGroup>
          );
        })}

        <Dropdown
          group
          isOpen={isDropdownOpen}
          size="lg"
          toggle={() => setDropdownOpen(!isDropdownOpen)}
        >
          <DropdownToggle caret>Add new exec member</DropdownToggle>
          <DropdownMenu style={{ width: "500px" }}>
            <FormGroup>
              <InputGroup className="mb-4">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fa fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Search for exec member..."
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
              </InputGroup>
            </FormGroup>

            <div style={{ maxHeight: 400, overflow: "scroll" }}>
              {users
                .filter((user) => user._id && !execMembers.includes(user._id))
                .filter((user) =>
                  `${user.first_name} ${user.last_name} ${user.email}`
                    .toLowerCase()
                    .includes(searchFilter.toLowerCase())
                )
                .map((user) => (
                  <>
                    <Card className="card-stats mb-4 mb-xl-0">
                      <CardBody>
                        <Row>
                          <div className="col">
                            <CardTitle
                              tag="h5"
                              className="text-uppercase text-muted mb-0"
                            >
                              {getEnumKeyByEnumValue(
                                PermLevel,
                                user.perm_level!
                              )}
                            </CardTitle>
                            <span className="h2 font-weight-bold mb-0">
                              {`${user.first_name} ${user.last_name}`}
                            </span>
                          </div>
                          <Col className="col-auto">
                            <a
                              className="avatar avatar-sm"
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                              style={{
                                objectFit: "cover",
                                height: "48px",
                                width: "48px",
                              }}
                            >
                              <img
                                alt="..."
                                className="rounded-circle"
                                src={
                                  user.image ||
                                  "https://campus42.co.uk/images/favicon.ico"
                                }
                                style={{
                                  objectFit: "cover",
                                  height: "48px",
                                  width: "48px",
                                }}
                              />
                            </a>
                          </Col>
                        </Row>
                        <p className="mt-3 mb-0 text-muted text-sm">
                          {/*<span className="text-success mr-2">*/}
                          {/*  <i className="fa fa-arrow-up" /> 3.48%*/}
                          {/*</span>{" "}*/}
                          <span className="text-nowrap">{user.email}</span>
                        </p>
                      </CardBody>
                      <Button
                        onClick={() => {
                          setExecMembers([...execMembers, user._id!]);
                          setDropdownOpen(false);
                        }}
                      >
                        Add {`${user.first_name} ${user.last_name}`}
                      </Button>
                    </Card>
                  </>
                ))}
            </div>
          </DropdownMenu>
        </Dropdown>

        <hr />

        <Form>
          <FormGroup row>
            <Label for="president" sm={2}>
              President
            </Label>
            <Col sm={10}>
              <Input
                type="select"
                name="president"
                id="president"
                placeholder="No member defined"
                value={execRoles.president}
                onChange={(e) => {
                  let uid = e.target.value;
                  setExecRoles({
                    ...execRoles,
                    [e.target.name]: uid,
                  });
                }}
              >
                {users
                  .filter((user) => user._id && execMembers.includes(user._id))
                  .map((user) => (
                    <option
                      value={user._id}
                    >{`${user.first_name} ${user.last_name} (${user.email})`}</option>
                  ))}
              </Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="vice-president" sm={2}>
              VP
            </Label>
            <Col sm={10}>
              <Input
                type="select"
                name="vice_president"
                id="vice-president"
                placeholder="No member defined"
                value={execRoles.vice_president}
                onChange={(e) => {
                  let uid = e.target.value;
                  setExecRoles({
                    ...execRoles,
                    [e.target.name]: uid,
                  });
                }}
              >
                <option value="" selected={!execRoles.vice_president}>
                  None
                </option>
                {users
                  .filter((user) => user._id && execMembers.includes(user._id))
                  .map((user) => (
                    <option
                      value={user._id}
                    >{`${user.first_name} ${user.last_name} (${user.email})`}</option>
                  ))}
              </Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="secretary" sm={2}>
              Secretary
            </Label>
            <Col sm={10}>
              <Input
                type="select"
                name="secretary"
                id="secretary"
                placeholder="No member defined"
                value={execRoles.secretary}
                onChange={(e) => {
                  let uid = e.target.value;
                  setExecRoles({
                    ...execRoles,
                    [e.target.name]: uid,
                  });
                }}
              >
                {users
                  .filter((user) => user._id && execMembers.includes(user._id))
                  .map((user) => (
                    <option
                      value={user._id}
                    >{`${user.first_name} ${user.last_name} (${user.email})`}</option>
                  ))}
              </Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="social-secretary" sm={2}>
              Social Secretary
            </Label>
            <Col sm={10}>
              <Input
                type="select"
                name="social_secretary"
                id="social-secretary"
                placeholder="No member defined"
                value={execRoles.social_secretary}
                onChange={(e) => {
                  let uid = e.target.value;
                  setExecRoles({
                    ...execRoles,
                    [e.target.name]: uid,
                  });
                }}
              >
                {users
                  .filter((user) => user._id && execMembers.includes(user._id))
                  .map((user) => (
                    <option
                      value={user._id}
                    >{`${user.first_name} ${user.last_name} (${user.email})`}</option>
                  ))}
              </Input>
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

export default SetExecMembersModal;
