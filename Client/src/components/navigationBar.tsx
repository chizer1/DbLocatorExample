import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  FaLink,
  FaUser,
  FaDatabase,
  FaServer,
  FaCode,
  FaBuilding,
} from "react-icons/fa";

const NavigationBar = () => {
  const location = useLocation();

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          DbLocator
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/connections"
              className={location.pathname === "/connections" ? "active" : ""}
            >
              <FaLink className="me-1" /> Connections
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/databaseUsers"
              className={location.pathname === "/databaseUsers" ? "active" : ""}
            >
              <FaUser className="me-1" /> Database Users
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/databases"
              className={location.pathname === "/databases" ? "active" : ""}
            >
              <FaDatabase className="me-1" /> Databases
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/databaseServers"
              className={
                location.pathname === "/databaseServers" ? "active" : ""
              }
            >
              <FaServer className="me-1" /> Database Servers
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/databaseTypes"
              className={location.pathname === "/databaseTypes" ? "active" : ""}
            >
              <FaCode className="me-1" /> Database Types
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/tenants"
              className={location.pathname === "/tenants" ? "active" : ""}
            >
              <FaBuilding className="me-1" /> Tenants
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
