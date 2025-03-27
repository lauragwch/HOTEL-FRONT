import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import profilService from "../Services/profilService";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await profilService.sendEmailToChangePassword({ email });
            setMessage("Un email de réinitialisation a été envoyé.");
        } catch (error) {
            console.error(error);
            setMessage("Une erreur est survenue. Veuillez réessayer.");
        }
    };

    return (
        <Container className="d-flex flex-column align-items-center mt-5">
            <h1>Mot de passe oublié</h1>
            <Form onSubmit={handleSubmit} className="w-50">
                <Form.Group controlId="email" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Entrez votre email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                {message && <p>{message}</p>}
                <Button variant="primary" type="submit" className="w-100">
                    Envoyer
                </Button>
            </Form>
        </Container>
    );
};

export default ForgotPasswordPage;