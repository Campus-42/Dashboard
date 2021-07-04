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
  UncontrolledTooltip,
} from "reactstrap";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Header from "../components/Headers/Header";
import { collections } from "../services/firebaseApp";
import { Society } from "../interfaces/Society";
import { PermLevel, UserInfo } from "../interfaces/UserInfo";
import usePaginatedState from "../hooks/usePaginatedState";

import LoadingOverlay from "../components/Functional/LoadingOverlay";
import SetExecMembersModal from "../components/Modals/SetExecMembersModal";
import TruncatedDescription from "../components/Text/TruncatedDescription";
import UserInfoContext from "../contexts/UserInfoContext";
import ViewSocietyDetails from "../components/Modals/ViewSocietyDetails";
import { HasPermissionLevel } from "../services/permissions";
import { campusIdState } from "../state/campusIdState";
import { useRecoilValue } from "recoil";

const Societies = () => {
  let userInfo = useContext(UserInfoContext);
  let campusId = useRecoilValue(campusIdState);

  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState<boolean>(true);

  const [users, setUsers] = useState<Array<UserInfo>>([]);

  const [entries, setEntries] = useState<Array<Society>>([]);

  const [
    pagination,
    setPagination,
    societies,
    setSocieties,
    pages,
  ] = usePaginatedState<Society>();

  const loadSocieties = useCallback(async () => {
    if (!campusId) return;
    setLoading(true);
    let snapshot = await collections.societies(campusId).get();
    if (snapshot.empty) return;
    setEntries(
      (snapshot.docs
        .map((doc) => ({
          ...doc.data(),
          _id: doc.id,
        }))
        .filter((doc) => Object.keys(doc).length > 1) as Society[]).sort(
        (socA, socB) => socB.posted_date - socA.posted_date
      )
    );
    setLoading(false);
  }, [setEntries, campusId]);

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
    loadSocieties();
    loadUsers();
  }, [loadSocieties, loadUsers]);

  useEffect(() => {
    setSocieties(
      entries.filter((event) =>
        Object.values(event).some((val) =>
          val?.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      )
    );
  }, [entries, setSocieties, searchText]);

  const [modalSociety, setSocietyModal] = useState<Society | false>(false);

  const [societyDetails, showSociety] = useState<Society | false>(false);

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
                <h3 className="mb-0">Societies</h3>
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

              <Table
                className="align-items-center table-flush"
                responsive
                style={{
                  minHeight: "240px",
                }}
              >
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Project</th>
                    <th scope="col">Description</th>
                    <th scope="col">Status</th>
                    <th scope="col">Exec members</th>
                    {/*<th scope="col">Completion</th>*/}
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {societies.map((society) => (
                    <tr>
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
                            <span className="mb-0 text-sm">{society.name}</span>
                          </Media>
                        </Media>
                      </th>
                      <td
                        style={{
                          maxWidth: 300,
                        }}
                      >
                        <TruncatedDescription
                          text={society.description}
                          autowrap={30}
                          onExpand={(text) => {
                            showSociety(society);
                            return false;
                          }}
                        />
                      </td>
                      <td>
                        <Badge color="" className="badge-dot mr-4">
                          {(() => {
                            if (!society.visible)
                              return (
                                <>
                                  <i className="bg-danger" />
                                  blocked
                                </>
                              );

                            if (society.confirmed)
                              return (
                                <>
                                  <i className="bg-success" />
                                  approved
                                </>
                              );

                            return (
                              <>
                                <i className="bg-warning" />
                                pending
                              </>
                            );
                          })()}
                        </Badge>
                      </td>
                      <td>
                        <div className="avatar-group">
                          {society.exec_members?.map((member) => {
                            let memberInfo = users.find(
                              (user) => user._id === member
                            );
                            if (!memberInfo)
                              return (
                                <>
                                  <a
                                    className="avatar avatar-sm"
                                    href="#/"
                                    id={"tooltip-" + member}
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    <img
                                      alt="..."
                                      className="rounded-circle"
                                      src={
                                        "https://campus42.co.uk/images/favicon.ico"
                                      }
                                    />
                                  </a>
                                  <UncontrolledTooltip
                                    delay={0}
                                    target={"tooltip-" + member}
                                  >
                                    {member}
                                  </UncontrolledTooltip>
                                </>
                              );

                            return (
                              <>
                                <a
                                  className="avatar avatar-sm"
                                  href="#/"
                                  id={"tooltip-" + member}
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <img
                                    alt="..."
                                    className="rounded-circle"
                                    style={{
                                      objectFit: "cover",
                                      height: "32px",
                                      width: "32px",
                                    }}
                                    src={
                                      memberInfo.image ||
                                      "https://campus42.co.uk/images/favicon.ico"
                                    }
                                  />
                                </a>
                                <UncontrolledTooltip
                                  delay={0}
                                  target={"tooltip-" + member}
                                >
                                  {`${memberInfo.first_name} ${memberInfo.last_name}`}
                                </UncontrolledTooltip>
                              </>
                            );
                          })}
                        </div>
                      </td>
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
                            role="button"
                            size="sm"
                            color=""
                            onClick={(e) => e.preventDefault()}
                          >
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem
                              onClick={async (e) => {
                                showSociety(society);
                              }}
                            >
                              View details
                            </DropdownItem>

                            {!society.confirmed && (
                              <DropdownItem
                                onClick={async (e) => {
                                  setLoading(true);
                                  await collections
                                    .societies(campusId!)
                                    .doc(society._id)
                                    .update({
                                      confirmed: true,
                                      review_logs: [
                                        ...society.review_logs,
                                        {
                                          uid: userInfo?._id,
                                          action: "approved",
                                          timestamp: new Date(Date.now()),
                                          message:
                                            "Your society application has been approved!",
                                        },
                                      ],
                                    });
                                  loadSocieties();
                                }}
                              >
                                Approve
                              </DropdownItem>
                            )}

                            {!society.confirmed && (
                              <DropdownItem
                                onClick={async (e) => {
                                  setLoading(true);
                                  await collections
                                    .societies(campusId!)
                                    .doc(society._id)
                                    .update({
                                      confirmed: true,
                                      visible: false,
                                      review_logs: [
                                        ...society.review_logs,
                                        {
                                          uid: userInfo?._id,
                                          action: "denied",
                                          timestamp: new Date(Date.now()),
                                          message:
                                            "Your society application has been denied! Please contact support if you need further help.",
                                        },
                                      ],
                                    });
                                  loadSocieties();
                                }}
                              >
                                Deny
                              </DropdownItem>
                            )}

                            {HasPermissionLevel(userInfo, PermLevel.Admin) && (
                              <DropdownItem
                                onClick={(e) => setSocietyModal(society)}
                              >
                                Set Exec Members
                              </DropdownItem>
                            )}

                            {HasPermissionLevel(userInfo, PermLevel.Admin) &&
                              society.visible && (
                                <DropdownItem
                                  onClick={async (e) => {
                                    setLoading(true);
                                    await collections
                                      .societies(campusId!)
                                      .doc(society._id)
                                      .update({
                                        visible: false,
                                      });
                                    loadSocieties();
                                  }}
                                >
                                  Block
                                </DropdownItem>
                              )}

                            {!society.visible && (
                              <DropdownItem
                                href="#/"
                                onClick={async (e) => {
                                  setLoading(true);
                                  await collections
                                    .societies(campusId!)
                                    .doc(society._id)
                                    .update({
                                      visible: true,
                                    });
                                  loadSocieties();
                                }}
                              >
                                Unblock
                              </DropdownItem>
                            )}
                            {/*<DropdownItem*/}
                            {/*  href="#/"*/}
                            {/*  onClick={(e) => e.preventDefault()}*/}
                            {/*>*/}
                            {/*  Another action*/}
                            {/*</DropdownItem>*/}
                            {/*<DropdownItem*/}
                            {/*  href="#/"*/}
                            {/*  onClick={(e) => e.preventDefault()}*/}
                            {/*>*/}
                            {/*  Something else here*/}
                            {/*</DropdownItem>*/}
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

      {modalSociety && (
        <SetExecMembersModal
          show={!!modalSociety}
          onSubmit={async ({ society }) => {
            try {
              await collections
                .societies(campusId!)
                .doc(society._id)
                .update(society);
              setSocietyModal(false);
              loadSocieties();
              return true;
            } catch (e) {
              return false;
            }
          }}
          onClose={() => setSocietyModal(false)}
          society={modalSociety as Society}
          users={users}
        />
      )}

      {societyDetails && (
        <ViewSocietyDetails
          show={!!societyDetails}
          onSubmit={async () => false}
          onClose={() => showSociety(false)}
          society={societyDetails}
          users={users}
        />
      )}
    </>
  );
};

export default Societies;
