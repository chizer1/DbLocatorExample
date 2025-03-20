import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const NavigationBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          DbLocator
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/connections">
              Connections
            </Nav.Link>
            <Nav.Link as={Link} to="/databases">
              Databases
            </Nav.Link>
            <Nav.Link as={Link} to="/databaseServers">
              Database Servers
            </Nav.Link>
            <Nav.Link as={Link} to="/databaseTypes">
              Database Types
            </Nav.Link>
            <Nav.Link as={Link} to="/tenants">
              Tenants
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
