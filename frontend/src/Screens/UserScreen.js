import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Form,
  Modal,
  Tab,
  Table,
  Tabs,
} from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { approveApplication, declineApplication, listApplications } from '../actions/applicationActions';
import { editUserByAdmin, listUsers, removeUserByAdmin } from '../actions/userActions';
import { getCurrentUser } from '../authService';

function UserScreen() {
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(null);
  const [editingUserId, setEditingUserId] = useState('');
  const [editForm, setEditForm] = useState({ first_name: '', last_name: '', email: '' });
  const [message, setMessage] = useState('');

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [merchantId, setMerchantId] = useState('');
  const [declineReason, setDeclineReason] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);

  const users = useSelector((state) => state.userList.users || []);
  const applications = useSelector((state) => state.applicationData.applications || []);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    dispatch(listUsers());
    dispatch(listApplications());
  }, [dispatch]);

  const sortedApplications = useMemo(() => {
    return [...applications].sort((a, b) => b.id - a.id);
  }, [applications]);

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  if (currentUser.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  const startEdit = (user) => {
    setMessage('');
    setEditingUserId(user.id);
    setEditForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
  };

  const cancelEdit = () => {
    setEditingUserId('');
  };

  const saveEdit = async (userId) => {
    const response = await dispatch(editUserByAdmin(userId, editForm));

    if (!response.success) {
      setMessage(response.message);
      return;
    }

    setEditingUserId('');
    setMessage('User updated successfully.');
    dispatch(listUsers());
    window.dispatchEvent(new Event('auth-changed'));
  };

  const deleteHandler = async (userId) => {
    await dispatch(removeUserByAdmin(userId));
    dispatch(listUsers());
    dispatch(listApplications());
    setMessage('User deleted.');
    window.dispatchEvent(new Event('auth-changed'));
  };

  const openApproveModal = (application) => {
    setSelectedApplication(application);
    setMerchantId('');
    setShowApproveModal(true);
  };

  const openDeclineModal = (application) => {
    setSelectedApplication(application);
    setDeclineReason('');
    setShowDeclineModal(true);
  };

  const confirmApprove = async () => {
    const response = await dispatch(approveApplication(selectedApplication.id, merchantId));

    if (!response.success) {
      setMessage(response.message);
      return;
    }

    setShowApproveModal(false);
    setSelectedApplication(null);
    setMessage('Seller application approved and merchant ID assigned.');
    dispatch(listUsers());
    dispatch(listApplications());
    window.dispatchEvent(new Event('auth-changed'));
  };

  const confirmDecline = async () => {
    const response = await dispatch(declineApplication(selectedApplication.id, declineReason));

    if (!response.success) {
      setMessage(response.message);
      return;
    }

    setShowDeclineModal(false);
    setSelectedApplication(null);
    setMessage('Seller application declined.');
    dispatch(listApplications());
  };

  return (
    <div>
      <h1 className="h3 text-primary mb-3">Users Management</h1>
      <p className="text-muted">Admin-only page for user management and seller approvals.</p>

      {message ? <Alert variant="info">{message}</Alert> : null}

      <Tabs defaultActiveKey="users" className="mb-3">
        <Tab eventKey="users" title="All Users">
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <Table responsive hover className="align-middle mb-0">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        {editingUserId === user.id ? (
                          <Form.Control
                            value={editForm.first_name}
                            onChange={(event) =>
                              setEditForm((prevForm) => ({ ...prevForm, first_name: event.target.value }))
                            }
                          />
                        ) : (
                          user.first_name
                        )}
                      </td>
                      <td>
                        {editingUserId === user.id ? (
                          <Form.Control
                            value={editForm.last_name}
                            onChange={(event) =>
                              setEditForm((prevForm) => ({ ...prevForm, last_name: event.target.value }))
                            }
                          />
                        ) : (
                          user.last_name
                        )}
                      </td>
                      <td>
                        {editingUserId === user.id ? (
                          <Form.Control
                            type="email"
                            value={editForm.email}
                            onChange={(event) =>
                              setEditForm((prevForm) => ({ ...prevForm, email: event.target.value }))
                            }
                          />
                        ) : (
                          user.email
                        )}
                      </td>
                      <td>
                        <Badge bg={user.role === 'Admin' ? 'dark' : user.role === 'Seller' ? 'success' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="text-end">
                        {editingUserId === user.id ? (
                          <>
                            <Button size="sm" variant="success" className="me-2" onClick={() => saveEdit(user.id)}>
                              Save
                            </Button>
                            <Button size="sm" variant="outline-secondary" onClick={cancelEdit}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="primary" className="me-2" onClick={() => startEdit(user)}>
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => deleteHandler(user.id)}
                              disabled={user.role === 'Admin'}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="applications" title="Seller Applications">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Table responsive hover className="align-middle mb-0">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Decline Reason</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedApplications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-4">
                        No seller applications yet.
                      </td>
                    </tr>
                  ) : (
                    sortedApplications.map((application) => (
                      <tr key={application.id}>
                        <td>{application.username}</td>
                        <td>{application.user_email}</td>
                        <td>
                          <Badge bg={application.status === 'Approved' ? 'success' : application.status === 'Declined' ? 'danger' : 'warning'}>
                            {application.status}
                          </Badge>
                        </td>
                        <td>{application.decline_reason || '-'}</td>
                        <td className="text-end">
                          <Button
                            size="sm"
                            variant="success"
                            className="me-2"
                            onClick={() => openApproveModal(application)}
                            disabled={application.status !== 'Pending'}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => openDeclineModal(application)}
                            disabled={application.status !== 'Pending'}
                          >
                            Decline
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      <Modal show={showApproveModal} onHide={() => setShowApproveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Approve Seller Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Assign Merchant ID</Form.Label>
            <Form.Control
              value={merchantId}
              onChange={(event) => setMerchantId(event.target.value)}
              placeholder="Enter seller merchant ID"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowApproveModal(false)}>Cancel</Button>
          <Button variant="success" onClick={confirmApprove}>Approve</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeclineModal} onHide={() => setShowDeclineModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Decline Seller Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Reason for Declining</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={declineReason}
              onChange={(event) => setDeclineReason(event.target.value)}
              placeholder="Enter reason"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDeclineModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDecline}>Decline</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserScreen;
