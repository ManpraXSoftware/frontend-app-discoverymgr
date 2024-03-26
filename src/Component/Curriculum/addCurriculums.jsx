import { getAuthenticatedHttpClient } from "@edx/frontend-platform/auth";
import { ActionRow, Button, Form, ModalDialog, Toast } from "@edx/paragon";
import { useState } from "react";
import RichTextEditor from "react-rte";

const AddCurriculum =(props)=>{
    const [text, setText] = useState(RichTextEditor.createEmptyValue())
    const [textBrief, setTextBrief] = useState(RichTextEditor.createEmptyValue())
    const [show, setShow] = useState(false);

    const createCurriculum = (e) => {
        e.preventDefault()
        let curriculumdata = new FormData(e.target)
        curriculumdata.append("program", props.props.degree)
        curriculumdata.append('marketing_text', text.toString('html'))
        curriculumdata.append('marketing_text_brief', textBrief.toString('html'))
        curriculumdata.append('is_active', true)
        getAuthenticatedHttpClient().post(process.env.DISCOVERY_BASE_URL + `/api/mx/curriculums/`, curriculumdata)
            .then((res) => {
                if (res.status == 201){
                setShow(true)
                props.onClose()
                props.props.get_data(props.props.degree)
                setText(RichTextEditor.createEmptyValue());
                setTextBrief(RichTextEditor.createEmptyValue())
                }
            })
            .catch((err) => {
                console.log("update error", err)
            })
        e.target.reset()
    }

    const textChange = (value) => {
        setText(value)
    };

    const textBriefChange = (value) => {
        setTextBrief(value)
    };

    return (<>
        <ModalDialog
            title="My dialog"
            isOpen={props.open}
            onClose={() => {
                setText(RichTextEditor.createEmptyValue());
                setTextBrief(RichTextEditor.createEmptyValue());{props.onClose()};
            }}
            size="lg"
            variant="default"
            hasCloseButton
            isFullscreenOnMobile
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
                        <RichTextEditor
                            value={text}
                            onChange={textChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Markeiting Text Brief</Form.Label>
                        <RichTextEditor
                            value={textBrief}
                            onChange={textBriefChange}
                        />
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