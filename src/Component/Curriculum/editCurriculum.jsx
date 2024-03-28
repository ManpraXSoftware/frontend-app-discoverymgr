import { getAuthenticatedHttpClient } from "@edx/frontend-platform/auth";
import { ActionRow, Button, Form, ModalDialog, Toast } from "@edx/paragon";
import { useEffect, useState } from "react";
import WysiwygEditor from "../Shared/InputFields/Wysiwyg";

const EditCurriculum = (props) => {
    const [editorText, setEditorText] = useState({"text":"", "briefText":""})
    const [show, setShow] = useState(false);

    useEffect(()=>{
        setEditorText({"text":props.data?props.data.marketing_text:"","briefText":props.data?props.data.marketing_text_brief:""});
    },[props])

    const updateCurriculum = (e) => {
        e.preventDefault()
        let curriculumdata = new FormData(e.target)
        curriculumdata.append("program", props.data.program)
        curriculumdata.append('marketing_text', editorText.text.toString('html'))
        curriculumdata.append('marketing_text_brief', editorText.textBrief.toString('html'))
        curriculumdata.append('is_active', true)
        getAuthenticatedHttpClient().put(process.env.DISCOVERY_BASE_URL + `/api/v1/curriculums/${props.data.id}/`, curriculumdata)
            .then((res) => {
                if (res.status == 200){
                    props.onClose()
                    setShow(true)
                    setEditorText({"text":"","briefText":""});
                props.props.get_data(props.props.degree)
                }
            })
            .catch((err) => {
                console.log("update error",err)
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
            onClose={() => { props.onClose() }}
            size="lg"
            variant="default"
            hasCloseButton
            isFullscreenOnMobile
            isBlocking={true}
        >
            <ModalDialog.Header>
                <ModalDialog.Title>
                    Update Curriculum
                </ModalDialog.Title>
            </ModalDialog.Header>

            <ModalDialog.Body>
                <Form onSubmit={updateCurriculum}>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control name='name' defaultValue={props.data?props.data.name:""}></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Marketing Text</Form.Label>
                        <WysiwygEditor value={editorText.text} name='marketing_text' initialValue={editorText.text} onChange={(val) => handleChange("text",val)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Marketing Text Brief</Form.Label>
                        <WysiwygEditor value={editorText.textBrief} name='marketing_text_brief' initialValue={editorText.briefText} onChange={(val) => handleChange("textBrief", val)} />
                    </Form.Group>
                    <ActionRow>
                        <ModalDialog.CloseButton variant="tertiary">
                            Cancel
                        </ModalDialog.CloseButton>
                        <Button variant="primary" type='submit'>
                           Update
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
            Curriculum edited.
        </Toast></>
    )
}

export default EditCurriculum;