'use client'

import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Navbar, Container, Tab, Tabs, Form, ButtonGroup, Button, Table } from 'react-bootstrap';
import tocologo from '../../public/toco-logo.png';
import Image from 'next/image';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { BACKEND_URL } from './constants';

export default function Home() {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [transaction, setTransaction] = useState(null);
    const [fromUser, setFromUser] = useState("");
    const [toUser, setToUser] = useState("");
    const [amount, setAmount] = useState(0);
    const [username, setUsername] = useState("");

    useEffect(() => {
        getUsers();
        getTransactions();
    }, []);

    const getUsers = async () => {
        let res = await axios.get(`${BACKEND_URL}/user/`);
        setUsers(res.data);
    }

    const getTransactions = async () => {
        let res = await axios.get(`${BACKEND_URL}/transactions/`);
        setTransactions(res.data);
    }

    const handleCreateUser = async () => {
        try {
            let res = await axios.post(`${BACKEND_URL}/user/`, { username: username });
            setUser(res.data);
            await getUsers();    
        } catch (err: any) {
            Swal.fire({
                title: 'Error',
                text: `${err.response.data.message}`,
                icon: 'error',
                confirmButtonText: 'Okay'
            });
        }
    }

    const handleGetUser = async () => {
        try {
            let res = await axios.get(`${BACKEND_URL}/user/${username}`);
            console.log(res.data);
            setUser(res.data);                
        } catch (err: any) {
            Swal.fire({
                title: 'Error',
                text: `${err.response.data.message}`,
                icon: 'error',
                confirmButtonText: 'Okay'
            });
        }
    }

    const renderUser = () => {
        if (user !== null) {
            return (
                <tr>
                    <td>{user._id}</td>
                    <td>{user.username}</td>
                    <td>{user.balance}</td>
                    <td>{user.createdAt}</td>
                </tr>
            )    
        }
    }

    const handleOnChangeUsername = async (e: any) => {
        setUsername(e.target.value);
    }

    const handleOnChangeFromUsername = async (e: any) => {
        setFromUser(e.target.value);
    }

    const handleOnChangeToUsername = async (e: any) => {
        setToUser(e.target.value);
    }

    const handleOnChangeAmount = async (e: any) => {
        setAmount(e.target.value);
    }

    const handleCreateTransaction = async () => {
        try {
            let res = await axios.post(
                `http://localhost:3001/transactions/`,
                {
                    from: fromUser,
                    to: toUser,
                    amount: amount
                }
            );
        setTransaction(res.data);
        await getTransactions();                      
        } catch (err: any) {
            Swal.fire({
                title: 'Error',
                text: `${err.response.data.message}`,
                icon: 'error',
                confirmButtonText: 'Okay'
            });
        }
    }

    const renderTransaction = () => {
        if (transaction !== null) {
            return (
                <tr>
                    <td>{transaction.from}</td>
                    <td>{transaction.to}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.createdAt}</td>
                </tr>
            )    
        }
    }

    return(<>
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="#home">
                    <Image src={tocologo} alt={'toco logo'} height={50} width={50}/>
                    Toco App
                </Navbar.Brand>
            </Container>
        </Navbar>
        <Container>
            <Tabs
                defaultActiveKey="user"
                id="uncontrolled-tab-example"
                className="mb-3"
                style={{marginTop: '5%'}}
            >
                <Tab eventKey="user" title="User">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="inputUsername">Username</Form.Label>
                            <Form.Control
                                type="text"
                                id="inputUsername"
                                aria-describedby="usernameInputHelpText"
                                placeholder='Enter Username'
                                onChange={handleOnChangeUsername}
                            />
                            <Form.Text id="usernameInputHelpText" muted>
                                Enter username to create or find user. Username should be unique.
                            </Form.Text>
                        </Form.Group>
                        <ButtonGroup>
                            <Button variant="primary" type="button" onClick={handleCreateUser}>
                                CREATE USER
                            </Button>
                            <Button variant="success" type="button" onClick={handleGetUser}>
                                GET USER
                            </Button>
                        </ButtonGroup>
                    </Form>
                    <Table striped style={{marginTop: '5%', captionSide: 'top'}}>
                        <caption>Create / Get User Response:</caption>
                        <thead>
                            <tr>
                                <th>User Id</th>
                                <th>Username</th>
                                <th>Balance</th>
                                <th>CreatedAt</th>
                            </tr>
                        </thead>
                        <tbody>
                            { renderUser() }
                        </tbody>
                    </Table>
                    <Table striped style={{marginTop: '5%', captionSide: 'top'}}>
                        <caption>Transactions</caption>
                        <thead>
                            <tr>
                                <th>From User</th>
                                <th>To User</th>
                                <th>Amount</th>
                                <th>CreatedAt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction: any) => (
                                <tr>
                                <td>{transaction.from}</td>
                                <td>{transaction.to}</td>
                                <td>{transaction.amount}</td>
                                <td>{transaction.createdAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="transaction" title="Transaction">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="inputFromUsername">From Account:</Form.Label>
                            <Form.Control
                                type="text"
                                id="inputFromUsername"
                                aria-describedby="fromUsernameInputHelpText"
                                placeholder='Enter Username'
                                onChange={handleOnChangeFromUsername}
                            />
                            <Form.Text id="fromUsernameInputHelpText" muted>
                                Enter from account username
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="inputToUsername">To Account:</Form.Label>
                            <Form.Control
                                type="text"
                                id="inputToUsername"
                                aria-describedby="toUsernameInputHelpText"
                                placeholder='Enter Username'
                                onChange={handleOnChangeToUsername}
                            />
                            <Form.Text id="toUsernameInputHelpText" muted>
                                Enter to account username
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="inputAmount">Amount:</Form.Label>
                            <Form.Control
                                type="number"
                                id="inputAmount"
                                aria-describedby="amountInputHelpText"
                                placeholder='Enter Amount'
                                onChange={handleOnChangeAmount}
                            />
                            <Form.Text id="amountInputHelpText" muted>
                                Enter amount to be transferred
                            </Form.Text>
                        </Form.Group>
                        <ButtonGroup>
                            <Button variant="primary" type="button" onClick={handleCreateTransaction}>
                                CREATE TRANSACTION
                            </Button>
                        </ButtonGroup>
                    </Form>
                    <Table striped style={{marginTop: '5%', captionSide: 'top'}}>
                        <caption>Create Transaction Response:</caption>
                        <thead>
                            <tr>
                                <th>From User</th>
                                <th>To User</th>
                                <th>Amount</th>
                                <th>CreatedAt</th>
                            </tr>
                        </thead>
                        <tbody>
                                { renderTransaction() }
                        </tbody>
                    </Table>
                    <Table striped style={{marginTop: '5%', captionSide: 'top'}}>
                        <caption>Users</caption>
                        <thead>
                            <tr>
                                <th>User Id</th>
                                <th>Username</th>
                                <th>Balance</th>
                                <th>CreatedAt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user: any) => (
                                <tr>
                                    <td>{user._id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.balance}</td>
                                    <td>{user.createdAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>
        </Container>
    </>);
}
