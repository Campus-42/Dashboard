import React, { useCallback, useContext, useEffect, useState } from "react";
import UserInfoContext from "../contexts/UserInfoContext";
import { useRecoilValue } from "recoil";
import { campusIdState } from "../state/campusIdState";
import { Channel } from "../interfaces/Channel";
import usePaginatedState from "../hooks/usePaginatedState";
import { collections } from "../services/firebaseApp";
import LoadingOverlay from "../components/Functional/LoadingOverlay";
import Header from "../components/Headers/Header";
import {
  Badge,
  Button,
  Card,
  CardFooter,
  CardHeader,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
  UncontrolledDropdown,
} from "reactstrap";
import { HasPermissionLevel } from "../services/permissions";
import { PermLevel, UserInfo } from "../interfaces/UserInfo";
import CreateChannelModal from "../components/Modals/CreateChannelModal";
import SendChannelMsgModal from "../components/Modals/SendChannelMsgModal";

const Channels = () => {
  let userInfo = useContext(UserInfoContext);
  const campusId = useRecoilValue(campusIdState);

  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  const [entries, setEntries] = useState<Array<Channel>>([]);

  const [users, setUsers] = useState<Array<UserInfo>>([]);

  const [
    pagination,
    setPagination,
    channels,
    setChannels,
    pages,
  ] = usePaginatedState<Channel>();

  const loadChannels = useCallback(async () => {
    setLoading(true);
    if (!campusId) return;
    let channelSnapshot = await collections.channels(campusId).get();
    if (channelSnapshot.empty) return setLoading(false);

    setEntries(
      channelSnapshot.docs.map(
        (doc) =>
          ({
            ...doc.data(),
            _id: doc.id,
          } as Channel)
      )
    );
    setLoading(false);
  }, [setLoading, campusId, setEntries]);

  const loadUsers = useCallback(async () => {
    if (!campusId) return;
    let snapshot = await collections.users(campusId).get();
    if (snapshot.empty) return;
    setUsers(
      snapshot.docs.map((doc) => ({
        ...doc.data(),
        _id: doc.id,
      })) as UserInfo[]
    );
  }, [campusId]);

  useEffect(() => {
    loadChannels();
    loadUsers();
  }, [loadChannels, loadUsers]);

  useEffect(() => {
    setChannels(
      entries.filter((event) =>
        Object.values(event).some((val) =>
          val?.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      )
    );
  }, [entries, setChannels, searchText]);

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [messageModalOpen, setMessageModalOpen] = useState<string | false>(
    false
  );

  const [selectedChannel, setSelectedChannel] = useState<Channel>();

  return (
    <>
      {loading && <LoadingOverlay />}
      <Header />

      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Channels</h3>
              </CardHeader>
              <Form className="mr-3 d-none d-md-flex ml-lg-auto">
                <FormGroup className="mb-0">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="fas fa-search" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Search"
                      type="text"
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>
                <Button
                  className="btn-icon btn-3"
                  color="primary"
                  type="button"
                  onClick={() => setCreateModalOpen(true)}
                >
                  <span className="btn-inner--icon">
                    <i className="fa fa-plus" />
                  </span>
                  <span className="btn-inner--text">Create</span>
                </Button>
              </Form>
              <br />
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Timestamp</th>
                    {/*<th scope="col">Price</th>*/}
                    {/*<th scope="col">Society</th>*/}
                    {/*<th scope="col">Permissions</th>*/}
                    {/*<th scope="col">Exec members</th>*/}
                    {/*<th scope="col">Completion</th>*/}
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {channels.map((channel) => (
                    <tr key={channel.name}>
                      <th scope="row">
                        <Media className="align-items-center">
                          {/*<a*/}
                          {/*  className="avatar rounded-circle mr-3"*/}
                          {/*  href="#/"*/}
                          {/*  onClick={(e) => e.preventDefault()}*/}
                          {/*>*/}
                          {/*  <img*/}
                          {/*    alt="..."*/}
                          {/*    src={*/}
                          {/*      require("../assets/img/theme/bootstrap.jpg")*/}
                          {/*        .default*/}
                          {/*    }*/}
                          {/*  />*/}
                          {/*</a>*/}
                          <Media>
                            <span className="mb-0 text-sm">
                              {channel.name?.slice(0, 30)} {/*<Badge*/}
                              {/*  color={*/}
                              {/*    event.entryType === EntryType.Event*/}
                              {/*      ? "info"*/}
                              {/*      : "primary"*/}
                              {/*  }*/}
                              {/*>*/}
                              {/*  {event.entryType}*/}
                              {/*</Badge>*/}
                              {channel.disabled && (
                                <Badge color={"danger"}>Disabled</Badge>
                              )}
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>{channel.description.slice(0, 40)}...</td>
                      <td>
                        {channel.created?.toDate().toString().split("G")[0]}
                      </td>
                      {/*<td>£{event.price || 0}</td>*/}
                      {/*<td>{event.society_name.slice(0, 30)}</td>*/}
                      {/*<td>*/}
                      {/*  {getEnumKeyByEnumValue(*/}
                      {/*    PermLevel,*/}
                      {/*    user.perm_level || PermLevel.Member*/}
                      {/*  )}*/}
                      {/*</td>*/}
                      {/*<td>*/}
                      {/*  <div className="avatar-group">*/}
                      {/*    {society.exec_members.map((member) => {*/}
                      {/*      let memberInfo = users.find(*/}
                      {/*        (user) => user._id === member*/}
                      {/*      );*/}
                      {/*      if (!memberInfo)*/}
                      {/*        return (*/}
                      {/*          <>*/}
                      {/*            <a*/}
                      {/*              className="avatar avatar-sm"*/}
                      {/*              href="#/"*/}
                      {/*              id={"tooltip-" + member}*/}
                      {/*              onClick={(e) => e.preventDefault()}*/}
                      {/*            >*/}
                      {/*              <img*/}
                      {/*                alt="..."*/}
                      {/*                className="rounded-circle"*/}
                      {/*                src={*/}
                      {/*                  "https://campus42.co.uk/images/favicon.ico"*/}
                      {/*                }*/}
                      {/*              />*/}
                      {/*            </a>*/}
                      {/*            <UncontrolledTooltip*/}
                      {/*              delay={0}*/}
                      {/*              target={"tooltip-" + member}*/}
                      {/*            >*/}
                      {/*              {member}*/}
                      {/*            </UncontrolledTooltip>*/}
                      {/*          </>*/}
                      {/*        );*/}

                      {/*      return (*/}
                      {/*        <>*/}
                      {/*          <a*/}
                      {/*            className="avatar avatar-sm"*/}
                      {/*            href="#/"*/}
                      {/*            id={"tooltip-" + member}*/}
                      {/*            onClick={(e) => e.preventDefault()}*/}
                      {/*          >*/}
                      {/*            <img*/}
                      {/*              alt="..."*/}
                      {/*              className="rounded-circle"*/}
                      {/*              style={{*/}
                      {/*                objectFit: "cover",*/}
                      {/*                height: "32px",*/}
                      {/*                width: "32px",*/}
                      {/*              }}*/}
                      {/*              src={*/}
                      {/*                memberInfo.image ||*/}
                      {/*                "https://campus42.co.uk/images/favicon.ico"*/}
                      {/*              }*/}
                      {/*            />*/}
                      {/*          </a>*/}
                      {/*          <UncontrolledTooltip*/}
                      {/*            delay={0}*/}
                      {/*            target={"tooltip-" + member}*/}
                      {/*          >*/}
                      {/*            {`${memberInfo.first_name} ${memberInfo.last_name}`}*/}
                      {/*          </UncontrolledTooltip>*/}
                      {/*        </>*/}
                      {/*      );*/}
                      {/*    })}*/}
                      {/*  </div>*/}
                      {/*</td>*/}
                      {/*<td>*/}
                      {/*  <div className="d-flex align-items-center">*/}
                      {/*    <span className="mr-2">60%</span>*/}
                      {/*    <div>*/}
                      {/*      <Progress*/}
                      {/*        max="100"*/}
                      {/*        value="60"*/}
                      {/*        barClassName="bg-danger"*/}
                      {/*      />*/}
                      {/*    </div>*/}
                      {/*  </div>*/}
                      {/*</td>*/}
                      <td className="text-right">
                        <UncontrolledDropdown>
                          <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#/"
                            role="button"
                            size="sm"
                            color=""
                            onClick={(e) => e.preventDefault()}
                          >
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            {HasPermissionLevel(
                              userInfo,
                              PermLevel.Moderator
                            ) && (
                              <DropdownItem
                                onClick={(e) =>
                                  setMessageModalOpen(channel._id)
                                }
                              >
                                Send message
                              </DropdownItem>
                            )}

                            {HasPermissionLevel(
                              userInfo,
                              PermLevel.Moderator
                            ) && (
                              <DropdownItem
                                onClick={(e) => {
                                  setSelectedChannel(channel);
                                  setCreateModalOpen(true);
                                }}
                              >
                                Edit
                              </DropdownItem>
                            )}

                            {HasPermissionLevel(
                              userInfo,
                              PermLevel.Moderator
                            ) &&
                              !channel.disabled && (
                                <DropdownItem
                                  onClick={async (e) => {
                                    await collections
                                      .channels(campusId!)
                                      .doc(channel._id)
                                      .update({
                                        disabled: true,
                                      });
                                    await loadChannels();
                                  }}
                                >
                                  Disable
                                </DropdownItem>
                              )}

                            {HasPermissionLevel(
                              userInfo,
                              PermLevel.Moderator
                            ) &&
                              channel.disabled && (
                                <DropdownItem
                                  onClick={async (e) => {
                                    await collections
                                      .channels(campusId!)
                                      .doc(channel._id)
                                      .update({
                                        disabled: false,
                                      });
                                    await loadChannels();
                                  }}
                                >
                                  Enable
                                </DropdownItem>
                              )}
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    {/*<PaginationItem className="disabled">*/}
                    {/*  <PaginationLink*/}
                    {/*    href="#/"*/}
                    {/*    onClick={(e) => e.preventDefault()}*/}
                    {/*    tabIndex={-1}*/}
                    {/*  >*/}
                    {/*    <i className="fas fa-angle-left" />*/}
                    {/*    <span className="sr-only">Previous</span>*/}
                    {/*  </PaginationLink>*/}
                    {/*</PaginationItem>*/}
                    {pages.map((page) => (
                      <PaginationItem
                        className={
                          page.index === pagination.index ? "active" : ""
                        }
                      >
                        <PaginationLink
                          href="#/"
                          onClick={(e) =>
                            setPagination({
                              ...pagination,
                              index: page.index,
                            })
                          }
                        >
                          {page.index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    {/*<PaginationItem>*/}
                    {/*  <PaginationLink*/}
                    {/*    href="#/"*/}
                    {/*    onClick={(e) => e.preventDefault()}*/}
                    {/*  >*/}
                    {/*    2 <span className="sr-only">(current)</span>*/}
                    {/*  </PaginationLink>*/}
                    {/*</PaginationItem>*/}
                    {/*<PaginationItem>*/}
                    {/*  <PaginationLink*/}
                    {/*    href="#/"*/}
                    {/*    onClick={(e) => e.preventDefault()}*/}
                    {/*  >*/}
                    {/*    3*/}
                    {/*  </PaginationLink>*/}
                    {/*</PaginationItem>*/}
                    {/*<PaginationItem>*/}
                    {/*  <PaginationLink*/}
                    {/*    href="#/"*/}
                    {/*    onClick={(e) => e.preventDefault()}*/}
                    {/*  >*/}
                    {/*    <i className="fas fa-angle-right" />*/}
                    {/*    <span className="sr-only">Next</span>*/}
                    {/*  </PaginationLink>*/}
                    {/*</PaginationItem>*/}
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>

      {createModalOpen && (
        <CreateChannelModal
          users={users}
          show={createModalOpen}
          onClose={(refresh: boolean) => {
            setCreateModalOpen(false);
            setSelectedChannel(undefined);
            refresh && loadChannels();
          }}
          existingChannel={selectedChannel}
        />
      )}

      {messageModalOpen && (
        <SendChannelMsgModal
          channelId={messageModalOpen}
          onClose={() => setMessageModalOpen(false)}
        />
      )}
    </>
  );
};

export default Channels;
