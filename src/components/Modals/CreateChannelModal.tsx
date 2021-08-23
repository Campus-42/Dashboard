import React, { FC, useEffect, useState } from "react";
import {
  Alert,
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
import { getEnumKeyByEnumValue } from "../../utils";
import { PermLevel, UserInfo } from "../../interfaces/UserInfo";
import firebaseApp, { collections } from "../../services/firebaseApp";
import { Channel } from "../../interfaces/Channel";
import { useRecoilValue } from "recoil";
import { campusIdState } from "../../state/campusIdState";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import { FilePondFile } from "filepond";

import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
registerPlugin(FilePondPluginImagePreview);

interface IProps {
  show: boolean;
  onClose: Function;
  users: UserInfo[];

  existingChannel?: Channel;
}

function uuidv4() {
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

async function uploadImage(campus: string, image: FilePondFile) {
  let uuid = uuidv4();

  let imgRef = firebaseApp.storage().ref(`campuses/${campus}/channels/${uuid}`);

  let snapshot = await imgRef.put(await image.file.arrayBuffer(), {
    contentType: image.fileType,
    customMetadata: image.getMetadata(),
  });

  return snapshot.ref.getDownloadURL();
}

async function getFilePondObj(imgUrl: string) {
  const res = await fetch(imgUrl);
  return res.blob();
}

const CreateChannelModal: FC<IProps> = ({
  show,
  onClose,
  users,
  existingChannel,
}) => {
  const campusId = useRecoilValue(campusIdState);

  const [name, setName] = useState(existingChannel?.name || "");
  const [description, setDescription] = useState(
    existingChannel?.description || ""
  );
  const [canRespond, setCanRespond] = useState(
    existingChannel?.can_respond || false
  );

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  const [members, setMembers] = useState<string[]>(
    existingChannel?.member_uids || []
  );

  const [isAdminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [admins, setAdmins] = useState<string[]>(existingChannel?.admins || []);

  const [isSubmitting, setSubmitting] = useState(false);

  const [images, setImages] = useState<unknown[]>(
    existingChannel?.image ? [] : []
  );

  const [imgUpdated, setImgUpdated] = useState(false);

  const [error, setError] = useState<string | false>(false);

  useEffect(() => {
    async function checkImages() {
      if (existingChannel?.image) {
        setImages([await getFilePondObj(existingChannel.image)]);
      }
    }
    checkImages();
  }, [existingChannel]);

  async function submitForm() {
    if (!name) return setError("name");

    if (!description) return setError("description");

    if (images.length < 1) return setError("image");

    if (admins.length < 1) return setError("at least 1 admin required");

    setSubmitting(true);

    if (!existingChannel) {
      const createChannel = firebaseApp
        .functions()
        .httpsCallable("createChannel");

      let channelData: Record<string, any> = {
        campusKey: campusId,
        name,
        description,
        member_uids: members,
        admins,

        canRespond,

        creator: firebaseApp.auth().currentUser?.uid,
      };

      if (images.length > 0) {
        channelData.image = await uploadImage(
          campusId!,
          images[0] as FilePondFile
        );
      }

      const result = await createChannel(channelData);
      console.log(result);
    } else {
      await collections.channels(campusId!).doc(existingChannel._id).update({
        name,
        description,
        member_uids: members,
        admins,
        can_respond: canRespond,
      });

      if (imgUpdated) {
        if (images.length === 0) {
          // TODO: Delete image from storage
          await collections
            .channels(campusId!)
            .doc(existingChannel._id)
            .update({
              image: null,
            });
        } else {
          // Update image
          await collections
            .channels(campusId!)
            .doc(existingChannel._id)
            .update({
              image: await uploadImage(campusId!, images[0] as FilePondFile),
            });
        }
      }
    }

    setSubmitting(false);
    onClose(true);
  }

  return (
    <Modal
      className="modal-dialog-centered"
      isOpen={show}
      toggle={(e: any) => onClose(e)}
    >
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">
          {existingChannel ? "Edit channel" : "Create channel"}
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
        {error && (
          <Alert color="danger">
            <strong>Validation error.</strong> One or more missing fields:{" "}
            {error}
          </Alert>
        )}
        <Form>
          <FormGroup>
            <Label for="name">Name *</Label>
            <Col>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Label for="description">Description *</Label>
            <Col>
              <Input
                type="text"
                name="description"
                id="description"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Col>
          </FormGroup>

          <div className="custom-control custom-control-alternative custom-checkbox">
            <input
              className="custom-control-input"
              id="can_respond"
              type="checkbox"
              onChange={(e) => setCanRespond(e.target.checked)}
              checked={canRespond}
            />
            <label className="custom-control-label" htmlFor="can_respond">
              <span className="text-muted">Can respond</span>
            </label>
          </div>

          <br />

          <Label for="images">Image *</Label>

          <FilePond
            // @ts-ignore
            files={images}
            onupdatefiles={async (files) => {
              setImgUpdated(true);
              if (files.length === 0) return setImages([]);

              setImages(files);
            }}
            allowMultiple={false}
            maxFiles={1}
            name="images"
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          />

          <FormGroup>
            <Label>Admins</Label>
          </FormGroup>

          {admins.map((member_id) => {
            let userInfo = users.find((user) => user._id === member_id);
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
                      setAdmins(admins.filter((id) => id !== userInfo!._id))
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
            isOpen={isAdminDropdownOpen}
            size="lg"
            toggle={() => setAdminDropdownOpen(!isAdminDropdownOpen)}
          >
            <DropdownToggle caret>Add new admin</DropdownToggle>
            <DropdownMenu style={{ width: "500px" }}>
              <FormGroup>
                <InputGroup className="mb-4">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fa fa-search" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Search for member..."
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>

              <div style={{ maxHeight: 400, overflow: "scroll" }}>
                {users
                  .filter((user) => user._id && !admins.includes(user._id))
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
                            setAdmins([...admins, user._id!]);
                            // Add to members if not included already
                            !members.includes(user._id!) &&
                              setMembers([...members, user._id!]);
                            setAdminDropdownOpen(false);
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

          <div
            style={{
              height: 20,
            }}
          >
            {" "}
          </div>

          <FormGroup>
            <Label>Members</Label>
          </FormGroup>

          {members.map((member_id) => {
            let userInfo = users.find((user) => user._id === member_id);
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
                      setMembers(members.filter((id) => id !== userInfo!._id))
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
            <DropdownToggle caret>Add new member</DropdownToggle>
            <DropdownMenu style={{ width: "500px" }}>
              <FormGroup>
                <InputGroup className="mb-4">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fa fa-search" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Search for member..."
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>

              <div style={{ maxHeight: 400, overflow: "scroll" }}>
                {users
                  .filter((user) => user._id && !members.includes(user._id))
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
                            setMembers([...members, user._id!]);
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
            {existingChannel ? "Update" : "Create channel"}
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

export default CreateChannelModal;
