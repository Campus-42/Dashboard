import React, { useCallback, useContext, useEffect, useState } from "react";
import usePaginatedState from "../hooks/usePaginatedState";
import LoadingOverlay from "../components/Functional/LoadingOverlay";
import {
  Badge,
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
import Header from "../components/Headers/Header";

import { collections } from "../services/firebaseApp";
import { Event } from "../interfaces/Event";
import { Blog } from "../interfaces/Blog";
import { PermLevel } from "../interfaces/UserInfo";
import { HasPermissionLevel } from "../services/permissions";
import UserInfoContext from "../contexts/UserInfoContext";
import { useRecoilValue } from "recoil";
import { campusIdState } from "../state/campusIdState";
import moment from "moment";

enum EntryType {
  Event = "Event",
  Blog = "Blog",
}

interface TableEntry {
  title: string;
  description: string;
  timestamp: Date;
  society_name: string;

  price?: string;

  _id?: string;
  visible?: boolean;

  entryType: EntryType;
}

const Events = () => {
  let userInfo = useContext(UserInfoContext);
  const campusId = useRecoilValue(campusIdState);

  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  const [entries, setEntries] = useState<Array<TableEntry>>([]);

  const [
    pagination,
    setPagination,
    events,
    setEvents,
    pages,
  ] = usePaginatedState<TableEntry>();

  const loadEvents = useCallback(async () => {
    setLoading(true);
    if (!campusId) return;
    let snapshot = await collections.events(campusId).get();
    let blogSnapshot = await collections.blogs(campusId).get();
    if (snapshot.empty) return setLoading(false);
    setEntries(
      [
        ...snapshot.docs.map((doc) => {
          let data = doc.data() as Event;
          console.log(data);

          let createDate = data.edit_log?.sort((logA, logB) => {
            let a =
              typeof logA?.date === "object"
                ? logA?.date?.toMillis()
                : moment(logA?.date, "D MMMM YYYY at HH:mm:ss").date();
            let b =
              typeof logB?.date === "object"
                ? logB?.date?.toMillis()
                : moment(logB?.date, "D MMMM YYYY at HH:mm:ss").date();
            return a - b;
          })[0]?.date;

          return {
            title: data.title,
            description: data.description.slice(0, 40),
            timestamp:
              typeof createDate === "object"
                ? createDate.toDate()
                : moment(createDate, "D MMMM YYYY at HH:mm:ss").toDate(),
            society_name: data.society_name,
            entryType: EntryType.Event,
            _id: doc.id,

            visible: data.visible,
          };
        }),
        ...blogSnapshot.docs.map((doc) => {
          let data = doc.data() as Blog;
          console.log(data);

          let createDate = data.edit_log?.sort((logA, logB) => {
            let a =
              typeof logA?.date === "object"
                ? logA?.date?.toMillis()
                : moment(logA?.date, "D MMMM YYYY at HH:mm:ss").date();
            let b =
              typeof logB?.date === "object"
                ? logB?.date?.toMillis()
                : moment(logB?.date, "D MMMM YYYY at HH:mm:ss").date();
            return a - b;
          })[0]?.date;

          return {
            title: data.su_title,
            timestamp:
              typeof createDate === "object"
                ? createDate.toDate()
                : moment(createDate, "D MMMM YYYY at HH:mm:ss").toDate(),
            description: data.blog_content
              .filter((content) => content.type === "Text")
              .map((content) => content.value)
              .join("\n")
              .slice(0, 40),
            society_name: data.society_name,
            entryType: EntryType.Blog,

            _id: doc.id,
            visible: data.visible,
          } as TableEntry;
        }),
      ].sort((a, b) => {
        console.log(b, a);
        return b.timestamp > a.timestamp ? 1 : -1;
      })
    );
    setLoading(false);
  }, [setEntries, campusId]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    setEvents(
      entries.filter((event) =>
        Object.values(event).some((val) =>
          val?.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      )
    );
  }, [entries, setEvents, searchText]);

  return (
    <>
      {loading && <LoadingOverlay />}
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Events</h3>
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
              </Form>
              <br />
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Description</th>
                    <th scope="col">Timestamp</th>
                    <th scope="col">Price</th>
                    <th scope="col">Society</th>
                    {/*<th scope="col">Permissions</th>*/}
                    {/*<th scope="col">Exec members</th>*/}
                    {/*<th scope="col">Completion</th>*/}
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event._id}>
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
                              {event.title?.slice(0, 30)}{" "}
                              <Badge
                                color={
                                  event.entryType === EntryType.Event
                                    ? "info"
                                    : "primary"
                                }
                              >
                                {event.entryType}
                              </Badge>
                              {event.visible === false && (
                                <Badge color={"danger"}>Blocked</Badge>
                              )}
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>{event.description}...</td>
                      <td>{event.timestamp?.toString().split("G")[0]}</td>
                      <td>£{event.price || 0}</td>
                      <td>{event.society_name.slice(0, 30)}</td>
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
                            {/*<DropdownItem*/}
                            {/*  onClick={(e) => setPermissionsModal(user)}*/}
                            {/*>*/}
                            {/*  Set Permissions*/}
                            {/*</DropdownItem>*/}
                            {/*<DropdownItem*/}
                            {/*  href="#/"*/}
                            {/*  onClick={(e) => e.preventDefault()}*/}
                            {/*>*/}
                            {/*  Another action*/}
                            {/*</DropdownItem>*/}
                            {HasPermissionLevel(userInfo, PermLevel.Admin) && (
                              <DropdownItem
                                onClick={async () => {
                                  setLoading(true);
                                  switch (event.entryType) {
                                    case EntryType.Blog:
                                      await collections
                                        .blogs(campusId!)
                                        .doc(event._id)
                                        .update({
                                          visible: false,
                                        });
                                      break;
                                    case EntryType.Event:
                                      await collections
                                        .events(campusId!)
                                        .doc(event._id)
                                        .update({
                                          visible: false,
                                        });
                                      break;
                                    default:
                                      break;
                                  }
                                  await loadEvents();
                                  setLoading(false);
                                }}
                              >
                                Block
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

        {/* Dark table */}
        <Row className="mt-5"></Row>
      </Container>
    </>
  );
};

export default Events;
