import { getAuthenticatedHttpClient } from "@edx/frontend-platform/auth";
import { ActionRow, Button, Form, ModalDialog, Toast } from "@edx/paragon";
import { useState } from "react";
import WysiwygEditor from "../Shared/InputFields/Wysiwyg";

const AddCurriculum =(props)=>{
    const [editorText, setEditorText] = useState({"text":"", "briefText":""})
    const [show, setShow] = useState(false);

    const createCurriculum = (e) => {
        e.preventDefault()
        let curriculumdata = new FormData(e.target)
        curriculumdata.append("program", props.props.degree)
        curriculumdata.append('marketing_text', editorText.text.toString('html'))
        curriculumdata.append('marketing_text_brief', editorText.textBrief.toString('html'))
        curriculumdata.append('is_active', true)
        getAuthenticatedHttpClient().post(process.env.DISCOVERY_BASE_URL + `/api/v1/curriculums/`, curriculumdata)
            .then((res) => {
                if (res.status == 201){
                setShow(true)
                props.onClose()
                props.props.get_data(props.props.degree)
                }
            })
            .catch((err) => {
                console.log("update error", err)
            })
        e.target.reset()
    }

    const handleChange = (field,val) => {
        setEditorText({...editorText, [field]:val})
    }

    return (<>
        <ModalDialog
            title="My dialog"
            isOpen={props.open}
            onClose={() => {props.onClose()}}
            size="lg"
            variant="default"
            hasCloseButton
            isFullscreenOnMobile
            isBlocking={true}
        >
            <ModalDialog.Header>
                <ModalDialog.Title>
                    Create Curriculum
                </ModalDialog.Title>
            </ModalDialog.Header>

            <ModalDialog.Body>
                <Form onSubmit={createCurriculum}>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control name='name'></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Marketing Text</Form.Label>
                        <WysiwygEditor value={editorText.text} name='marketing_text' initialValue="" onChange={(val) => handleChange("text",val)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Marketing Text Brief</Form.Label>
                        <WysiwygEditor value={editorText.textBrief} name='marketing_text_brief' initialValue="" onChange={(val) => handleChange("textBrief", val)} />
                    </Form.Group>
                    <ActionRow>
                        <ModalDialog.CloseButton variant="tertiary">
                            Cancel
                        </ModalDialog.CloseButton>
                        <Button variant="primary" type='submit'>
                            Submit
                        </Button>
                    </ActionRow>
                </Form>
            </ModalDialog.Body>
        </ModalDialog>
        <Toast
            onClose={() => setShow(false)}
            show={show}
            delay={2000}
        >
            Curriculum created.
        </Toast></>
    )
}

export default AddCurriculum;