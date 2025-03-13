import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import AuthService from "../Services/authService";

const LoginPage = () => {

    const [user, setUser] = useState({email: '', password: ''});

        const handleChange = (e) => {
            setUser({ ...user, [e.target.name]: e.target.value });
        }

        const handleSubmit = async (e) => {
            e.preventDefault();
            try{
                const response = await AuthService.login(user);
                console.log(response.data);

            } catch (error) {
                console.log(error);
            }

            console.log(user);
        }




    return ( <Container className="d-flex flex-column align-items-center mt-5">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={user.email} name="email" onChange={handleChange} />
          </Form.Group>
    
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={user.password} name="password" onChange={handleChange}/>
          </Form.Group>
         
          <Button variant="primary" type="submit">
            Se connecter
          </Button>
        </Form>
        </Container>
      );
    }

export default LoginPage;