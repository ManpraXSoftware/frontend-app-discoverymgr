import { ActionRow, AlertModal, Button, Collapsible, Icon, Toast } from "@edx/paragon"
import { Delete, Edit, Warning } from "@edx/paragon/icons"
import React, { useState } from "react"
import AddCurriculum from "./addCurriculums"
import EditCurriculum from "./editCurriculum"
import { getAuthenticatedHttpClient } from "@edx/frontend-platform/auth"


const Curriculums = (props) => {
    const [addCurriculumModalOpen, setAddCurriculumModalOpen] = useState(false);
    const [editCurriculumModalOpen, setEditCurriculumModalOpen] = useState(false);
    const [editedData, setEditedData] = useState(null)
    const [curriculumDeleteModal, setCurriculumDeleteModal] = useState(false);
    const [curriculumId, setCurriculumId] = useState(null);
    const [show, setShow] = useState(false);
    const renderHTML = (rawHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

    const closeModal = () => {
        setAddCurriculumModalOpen(false)
    }

    const closeEditModal = () => {
        setEditCurriculumModalOpen(false)
    }

    const deleteCurriculum = (id) => {
        getAuthenticatedHttpClient().delete(process.env.DISCOVERY_BASE_URL + `/api/v1/curriculums/${id}`).then(
            (res) => {
                if (res.status == 204) {
                    props.get_data(props.degree)
                    setCurriculumDeleteModal(false)
                    setShow(true)
                }
            }
        )
            .catch((err) => {
                console.log("errrrrr")
            })
    }

    return (<>
    <h4>Curriculums</h4>
    <div className="d-flex add-curriculum">
        <Button variant="primary" onClick={() => { setAddCurriculumModalOpen(true) }}>
            Add Curriculum
        </Button>
        </div>
        {props.data.map((item, index) => (<Collapsible
            styling="card"
            title={item.name}
            className='card-item'
        >
            <h5>Marketing Text</h5>
            <p>{renderHTML(item.marketing_text)}</p>
            <h5>Markeiting Text Brief</h5>
            <p>{renderHTML(item.marketing_text_brief)}</p>
            <Button variant="" size="sm" onClick={() => { setEditCurriculumModalOpen(true); setEditedData(item) }}><Icon src={Edit} /></Button>
            <Button variant="" size="sm" onClick={() => { setCurriculumId(item.id); setCurriculumDeleteModal(true) }}><Icon src={Delete} /></Button>
        </Collapsible>))}
        <AddCurriculum open={addCurriculumModalOpen} onClose={closeModal} props={props} />
        <EditCurriculum open={editCurriculumModalOpen} onClose={closeEditModal} data={editedData} props={props} />
        <AlertModal
            title="Warning Message"
            isOpen={curriculumDeleteModal}
            onClose={() => { setCurriculumDeleteModal(false) }}
            variant="warning"
            icon={Warning}
            footerNode={(
                <ActionRow>
                    <Button variant="tertiary" onClick={() => setCurriculumDeleteModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={() => { deleteCurriculum(curriculumId) }}>Delete</Button>
                </ActionRow>
            )}
        >
            <p>
                Are your sure you want to delete this curriculum? You can't undo this curriculum.
            </p>
        </AlertModal>
        <Toast
            onClose={() => setShow(false)}
            show={show}
            delay={2000}
        >
            Curriculum deleted.
        </Toast>
    </>)
}

export default Curriculums;