import React, { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { askChatbot, clearChatbot } from '../actions/chatActions';

function ChatbotScreen() {
  const dispatch = useDispatch();
  const [prompt, setPrompt] = useState('');
  const messages = useSelector((state) => state.chatData.messages || []);

  const submitHandler = (event) => {
    event.preventDefault();
    if (!prompt.trim()) {
      return;
    }

    dispatch(askChatbot(prompt.trim()));
    setPrompt('');
  };

  return (
    <div>
      <h1 className="h3 text-primary mb-3">Carpentry Chatbot</h1>
      <p className="text-muted">This assistant only answers carpentry and woodwork related questions.</p>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={submitHandler}>
            <Form.Group>
              <Form.Label>Ask a question</Form.Label>
              <Form.Control
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Example: How much does cabinet installation usually cost?"
              />
            </Form.Group>
            <div className="d-flex gap-2 mt-3">
              <Button type="submit" variant="primary">Ask</Button>
              <Button type="button" variant="outline-secondary" onClick={() => dispatch(clearChatbot())}>Clear</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          {messages.length === 0 ? (
            <p className="text-muted mb-0">No conversation yet.</p>
          ) : (
            messages.map((message, index) => (
              <div key={`${message.created_at}-${index}`} className="mb-4 border-bottom pb-3">
                <p className="mb-1"><strong>You:</strong> {message.question}</p>
                <p className="mb-0"><strong>Assistant:</strong> {message.answer}</p>
              </div>
            ))
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default ChatbotScreen;
