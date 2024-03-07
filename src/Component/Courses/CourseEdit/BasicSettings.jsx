import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { Button, Container, Form, Row } from '@edx/paragon';
import React, { useEffect, useState } from 'react';
import { WysiwygEditor } from '../../Shared/InputFields/Wysiwyg';

const BasicSettings = ({ settings, course_id, setLoading }) => {
    const { title, short_description, full_description, outcome, tags } = settings;
    const video = { src: settings.video ? settings.video.src : '' };
    const [basicSettings, setBasicSettings] = useState({
        title: title || "",
        short_description: short_description || "",
        full_description: full_description || "",
        outcome: outcome || "",
        video: video || { src: "" },
        tags: tags || [],
    });
    useEffect(() => {
        setBasicSettings({
            title: title || "",
            short_description: short_description || "",
            full_description: full_description || "",
            outcome: outcome || "",
            video: video || { src: "" },
            tags: tags || [],
        })
    }, [settings]);


    const handleChange = (e) => {
        const fieldName = e.target.name;
        const value = fieldName === "video" ? { ...basicSettings.video, src: e.target.value } : e.target.value;
        setBasicSettings({ ...basicSettings, [fieldName]: value });
    }

    const updateCourse = (e) => {
        e.preventDefault();
        setLoading(true)
        getAuthenticatedHttpClient().patch(`${process.env.DISCOVERY_BASE_URL}/api/mx/course_runs/${course_id}/`, basicSettings)
            .then((res) => setLoading(false))
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }
    return <Container>

        <Row as={Container} className='justify-content-between mt-5'><h1>Basic Settings</h1></Row>
        <Form onSubmit={updateCourse}>

            <Form.Group >
                <Form.Label >Title</Form.Label>
                <Form.Control name='title' value={basicSettings.title} onChange={handleChange} />
            </Form.Group>

            <Form.Group >
                <Form.Label >Short Description</Form.Label>
                <Form.Control as={WysiwygEditor} value={basicSettings.short_description} name='short_description' initialValue={basicSettings.short_description || ""} onChange={(val) => handleChange({ target: { name: "short_description", value: val } })} />
            </Form.Group>

            <Form.Group >
                <Form.Label >Full Description</Form.Label>
                <Form.Control as={WysiwygEditor} value={basicSettings.full_description} name='full_description' initialValue={basicSettings.full_description || ""} onChange={(val) => handleChange({ target: { name: "full_description", value: val } })} />
            </Form.Group>

            <Form.Group >
                <Form.Label >Outcome</Form.Label>
                {/* <Form.Control name='outcome' value={basicSettings.outcome} onChange={handleChange}  /> */}
                <Form.Control as={WysiwygEditor} value={basicSettings.outcome} name='outcome' initialValue={basicSettings.outcome || ""} onChange={(val) => handleChange({ target: { name: "outcome", value: val } })} />
            </Form.Group>

            <Form.Group >
                <Form.Label >Video</Form.Label>
                <Form.Control name='video' value={basicSettings.video.src} onChange={handleChange} />
            </Form.Group>

            <Form.Group >
                <Form.Label >Tags</Form.Label>
                <Form.Control name='tags' value={basicSettings.tags} onChange={handleChange} />
            </Form.Group>

            <div className="d-flex">
                <Button variant="primary" type="submit">
                    Update
                </Button>
            </div>
        </Form>
    </Container>
}

export default BasicSettings;
