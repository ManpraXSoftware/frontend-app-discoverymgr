import { ActionRow, AlertModal, Button, DataTable, Form, Icon, Toast } from "@edx/paragon"
import { Delete, Edit, Warning } from "@edx/paragon/icons"
import React, { useState } from "react"
import { getAuthenticatedHttpClient } from "@edx/frontend-platform/auth"
import "./quickfacts.css"


const Quickfacts = (props) => {
    const [editQuickfactdata, setEditQuickfactdata] = useState(null);
    const [quickfactserrors, setQuickfacterror] = useState([]);
    const [deleteAlertModal, setDeleteAlertModal] = useState(false)
    const [deletedQuickFact, setDeletedQuickFact] = useState(null)
    const [show, setShow] = useState(false);
    const [text, setText] = useState('')

    const createQuickFact = async (e) => {
        e.preventDefault()
        const form_data = new FormData(e.target)
        form_data.append("degree", props.degree)
        getAuthenticatedHttpClient().post(process.env.DISCOVERY_BASE_URL + '/api/mx/quickfacts/', form_data).then(
            (res) => {
                if (res.status == 201) {
                    setText("Quickfact created.")
                    setShow(true)
                    props.get_data(props.degree)
                    setQuickfacterror({})
                }
            }
        )
            .catch((err) => {
                setQuickfacterror(err.response.data)
            })
        e.target.reset()
    }

    const deleteQuickFact = (id) => {
        getAuthenticatedHttpClient().delete(process.env.DISCOVERY_BASE_URL + `/api/mx/quickfacts/${id}`).then(
            (res) => {
                if (res.status == 204) {
                    setText("Quickfact deleted.")
                    setShow(true)
                    props.get_data(props.degree)
                    setDeleteAlertModal(false)
                }
            }
        )
            .catch((err) => {
                console.log("errrrrr")
            })
    }

    const editQuickFact = (quickfact) => {
        setEditQuickfactdata(quickfact)
    }

    const updateQuickFact = (e) => {
        e.preventDefault()
        let quickdata = new FormData(e.target)
        quickdata.append("degree", props.degree)
        getAuthenticatedHttpClient().put(process.env.DISCOVERY_BASE_URL + `/api/mx/quickfacts/${editQuickfactdata.id}/`, quickdata)
            .then((res) => {
                if (res.status == 200) {
                    props.get_data(props.degree)
                    setEditQuickfactdata(null)
                    setText("Quickfact updated.")
                    setShow(true)
                }
            })
            .catch((err) => {
                console.log("update error")
            })
        e.target.reset()
    }

    return (<>
        <Form onSubmit={editQuickfactdata != null ? updateQuickFact : createQuickFact}>
            <Form.Row>
                <Form.Group>
                    <Form.Label>Text</Form.Label>
                    <Form.Control name='text' defaultValue={editQuickfactdata != null ? editQuickfactdata.text : ''} />
                    {quickfactserrors.text ?
                        <Form.Control.Feedback type="invalid">
                            {quickfactserrors.text}
                        </Form.Control.Feedback> : ""}
                </Form.Group>
                <Form.Group>
                    <Form.Label>Icon</Form.Label>
                    <Form.Control as='select' name='icon'>
                        <option value='fa-bell' selected={editQuickfactdata != null ? editQuickfactdata.icon == "Bell" : false}>Bell</option>
                        <option value='fa-certificate' selected={editQuickfactdata != null ? editQuickfactdata.icon == "Certificate" : false}>Certificate</option>
                        <option value='fa-check-circle' selected={editQuickfactdata != null ? editQuickfactdata.icon == "Checkmark" : false}>Checkmark</option>
                        <option value='fa-clock-o' selected={editQuickfactdata != null ? editQuickfactdata.icon == "Clock" : false}>Clock</option>
                        <option value='fa-desktop' selected={editQuickfactdata != null ? editQuickfactdata.icon == "Desktop" : false}>Desktop</option>
                        <option value='fa-info-circle' selected={editQuickfactdata != null ? editQuickfactdata.icon == "Info" : false}>Info</option>
                        <option value='fa-sitemap' selected={editQuickfactdata != null ? editQuickfactdata.icon == "Sitemap" : false}>Sitemap</option>
                        <option value='fa-user' selected={editQuickfactdata != null ? editQuickfactdata.icon == "User" : false}>User</option>
                        <option value='fa-dollar' selected={editQuickfactdata != null ? editQuickfactdata.icon == "Dollar" : false}>Dollar</option>
                        <option value='fa-book' selected={editQuickfactdata != null ? editQuickfactdata.icon == "Book" : false}>Book</option>
                        <option value='fa-mortar-board' selected={editQuickfactdata != null ? editQuickfactdata.icon == "Mortar Board" : false}>Mortar Board</option>
                        <option value='fa-star' selected={editQuickfactdata != null ? editQuickfactdata.icon == "Star" : false}>Star</option>
                        <option value='fa-trophy' selected={editQuickfactdata != null ? editQuickfactdata.icon == "Trophy" : false}>Trophy</option>
                    </Form.Control>
                    {quickfactserrors.icon ?
                        <Form.Control.Feedback type="invalid">
                            {quickfactserrors.icon}
                        </Form.Control.Feedback> : ""}
                </Form.Group>
                <div className="quickfact-submit">
                    <Button variant="primary" type="submit">
                        {editQuickfactdata != null ? "Update" : "Submit"}
                    </Button>
                </div>
            </Form.Row>
        </Form>
        <DataTable
            itemCount={props.data.length}
            data={props.data}
            additionalColumns={[
                {
                    id: 'action',
                    Header: 'Action',
                    Cell: ({ row }) => <><Button variant="" size="sm" onClick={() => { setDeletedQuickFact(row.original.id); setDeleteAlertModal(true) }}><Icon src={Delete} /></Button>
                        <Button variant="" size="sm" onClick={() => editQuickFact(row.original)}><Icon src={Edit} /></Button></>,
                }
            ]}
            columns={[
                {
                    Header: 'Text',
                    accessor: 'text',

                },
                {
                    Header: 'Icon',
                    accessor: 'icon',
                },
            ]}
        >

            <DataTable.Table />
            <DataTable.EmptyTable content="No results found" />
        </DataTable>
        <AlertModal
            title="Warning Message"
            isOpen={deleteAlertModal}
            onClose={() => { setDeleteAlertModal(false) }}
            variant="warning"
            icon={Warning}
            footerNode={(
                <ActionRow>
                    <Button variant="tertiary" onClick={() => setDeleteAlertModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={() => { deleteQuickFact(deletedQuickFact) }}>Delete</Button>
                </ActionRow>
            )}
        >
            <p>
                Are your sure you want to delete this quickfact? You can't undo this quickfact.
            </p>
        </AlertModal>
        <Toast
            onClose={() => setShow(false)}
            show={show}
            delay={2000}
        >
            {text}
        </Toast>
    </>)
}

export default Quickfacts;