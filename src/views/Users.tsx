import React, { useCallback, useContext, useEffect, useState } from "react";
import { PermLevel, UserInfo } from "../interfaces/UserInfo";
import usePaginatedState from "../hooks/usePaginatedState";
import LoadingOverlay from "../components/Functional/LoadingOverlay";
import {
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

import { collections, firestore } from "../services/firebaseApp";
import SetPermissionsModal from "../components/Modals/SetPermissionsModal";
import { getEnumKeyByEnumValue } from "../utils";
import { HasPermissionLevel } from "../services/permissions";
import UserInfoContext from "../contexts/UserInfoContext";
import { useRecoilValue } from "recoil";
import { campusIdState } from "../state/campusIdState";

const Users = () => {
  let userInfo = useContext(UserInfoContext);
  const campusId = useRecoilValue(campusIdState);

  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState<boolean>(true);

  const [entries, setEntries] = useState<Array<UserInfo>>([]);

  const [
    pagination,
    setPagination,
    users,
    setUsers,
    pages,
  ] = usePaginatedState<UserInfo>();

  const loadUsers = useCallback(async () => {
    if (!campusId) return;
    setLoading(true);
    let snapshot = await collections.users(campusId).get();
    if (snapshot.empty) return setLoading(false);
    setEntries(
      snapshot.docs.map((doc) => ({
        ...doc.data(),
        _id: doc.id,
      })) as UserInfo[]
    );
    setLoading(false);
  }, [setEntries, campusId]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    setUsers(
      entries.filter((event) =>
        Object.values(event).some((val) =>
          val?.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      )
    );
  }, [entries, setUsers, searchText]);

  const [permissionsModalUser, setPermissionsModal] = useState<
    UserInfo | false
  >(false);

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
                <h3 className="mb-0">Users</h3>
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
                    <th scope="col">Full Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Permissions</th>
                    {/*<th scope="col">Exec members</th>*/}
                    {/*<th scope="col">Completion</th>*/}
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
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
                            <span className="mb-0 text-sm">{`${user.first_name} ${user.last_name}`}</span>
                          </Media>
                        </Media>
                      </th>
                      <td>{user.email}</td>
                      <td>
                        {getEnumKeyByEnumValue(
                          PermLevel,
                          user.perm_level || PermLevel.Member
                        )}
                      </td>
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
                              PermLevel.SuperAdmin
                            ) && (
                              <DropdownItem
                                onClick={(e) => setPermissionsModal(user)}
                              >
                                Set Permissions
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

      {permissionsModalUser !== false && (
        <SetPermissionsModal
          show={!!permissionsModalUser}
          userInfo={permissionsModalUser as UserInfo}
          onSubmit={async ({ userInfo, permLevel }) => {
            try {
              await firestore.collection("users").doc(userInfo._id).update({
                perm_level: permLevel,
              });
              setPermissionsModal(false);
              loadUsers();
              return true;
            } catch (e) {
              return false;
            }
          }}
          onClose={() => setPermissionsModal(false)}
        />
      )}
    </>
  );
};

export default Users;
