import Header from "../components/Headers/Header";
import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Container,
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
} from "reactstrap";
import { collections } from "../services/firebaseApp";
import usePaginatedState from "../hooks/usePaginatedState";
import { Report } from "../interfaces/Report";
import LoadingOverlay from "../components/Functional/LoadingOverlay";
import { useRecoilValue } from "recoil";
import { campusIdState } from "../state/campusIdState";
import ViewMessageModal from "../components/Modals/ViewMessageModal";
import { UserInfo } from "../interfaces/UserInfo";

const Reports = () => {
  const campusId = useRecoilValue(campusIdState);

  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState<boolean>(false);

  const [entries, setEntries] = useState<Array<Report>>([]);

  const [
    pagination,
    setPagination,
    reports,
    setReports,
    pages,
  ] = usePaginatedState<Report>();

  const loadReports = useCallback(async () => {
    if (!campusId) return;

    setLoading(true);
    let snapshot = await collections.reports(campusId).get();
    if (snapshot.empty) return setLoading(false);
    setEntries(
      (snapshot.docs
        .map((doc) => ({
          ...doc.data(),
          _id: doc.id,
        }))
        .filter((doc) => Object.keys(doc).length > 1) as Report[])
        .filter((doc) => doc.path_to_doc)
        .sort((socA, socB) => socB.timestamp_ms - socA.timestamp_ms)
    );
    setLoading(false);
  }, [setEntries, campusId]);

  const [users, setUsers] = useState<Array<UserInfo>>([]);

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
    loadReports();
    loadUsers();
  }, [loadReports, loadUsers]);

  useEffect(() => {
    setReports(
      entries.filter((event) =>
        Object.values(event).some((val) =>
          val?.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      )
    );
  }, [entries, setReports, searchText]);

  const [selectedReport, setSelectedReport] = useState<Report | false>(false);

  return (
    <>
      {loading && <LoadingOverlay />}
      <Header />

      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Reports</h3>
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
                    <th scope="col">Report type</th>
                    <th scope="col">Reason</th>
                    <th scope="col">Timestamp</th>
                    <th scope="col">Reported message</th>
                    {/*<th scope="col">Completion</th>*/}
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
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
                            <span className="mb-0 text-sm">
                              {report.report_type}
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td
                        style={{
                          maxWidth: 300,
                        }}
                      >
                        {report.reason}
                      </td>
                      <td>{new Date(report.timestamp_ms).toLocaleString()}</td>
                      <td>
                        <Button
                          color="primary"
                          type="button"
                          onClick={() => setSelectedReport(report)}
                        >
                          View message
                        </Button>
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

        <Row className="mt-5"></Row>
      </Container>

      {selectedReport !== false && (
        <ViewMessageModal
          report={selectedReport}
          onClose={() => setSelectedReport(false)}
          users={users}
        />
      )}
    </>
  );
};

export default Reports;
