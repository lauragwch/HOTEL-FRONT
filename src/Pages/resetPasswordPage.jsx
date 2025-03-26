import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import profilService from "../Services/profilService";

const ResetPasswordPage = () => {
    const {token} = useParams();
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(password !== passwordConfirm){
                return;
            }
            const response = await profilService.resetPassword(token, { password });
            navigate('/login');
        } catch (error) {
            console.error(error);
        }
    }

    return <Container className="d-flex flex-column align-items-center ">
        <h1>Reset Password</h1>
        <Form onSubmit={handleSubmit} className="w-50">
            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="passwordConfirm">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm your password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-5">
                Envoyer
            </Button>
        </Form>

    </Container>;
}
 
export default ResetPasswordPage;