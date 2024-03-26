import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { Button, Container, Form, Row } from '@edx/paragon';
import React, { useEffect, useState } from 'react';
import { WysiwygEditor } from '../../Shared/InputFields/Wysiwyg';
import MultipleSelect from '../../Shared/InputFields/MultipleSelect';
import { cleanObject } from '../../../utils';

const BasicSettings = ({ settings, course_id, setLoading, showToast }) => {
    const { title, short_description, full_description, outcome, tags } = settings;
    const video = { src: settings.video ? settings.video.src : '' };
    const [basicSettings, setBasicSettings] = useState({
        title: title || "",
        short_description: short_description || "",
        full_description: full_description || "",
        outcome: outcome || "",
        video: video || { src: null },
        tags: tags || [],
    });
    const [tagsOptions, setTagOptions] = useState([{ name: "", value: "" }])
    useEffect(() => {
        setBasicSettings({
            title: title || "",
            short_description: short_description || "",
            full_description: full_description || "",
            outcome: outcome || "",
            video: video || { src: null },
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
        getAuthenticatedHttpClient().patch(`${process.env.DISCOVERY_BASE_URL}/api/mx/course_runs/${course_id}/`, cleanObject(basicSettings))
            .then((res) => showToast("Basic Settings Updated", res.status, res.statusText))
            .catch((error) => {
                showToast("Failed to update basic settings", error.customAttributes.httpErrorStatus, error.code);
                setLoading(false);
            });
    }

    useEffect(() => {
        setLoading(true)
        getAuthenticatedHttpClient().get(`${process.env.DISCOVERY_BASE_URL}/taggit_autosuggest/list/taggit.tag/`, cleanObject(basicSettings))
            .then((res) => setTagOptions(res.data.map((v, i) => { return { label: v.name, value: v.value } })))
            .catch((error) => {
                setLoading(false);
            });
    }, [])
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
                <MultipleSelect name="tags" dynamic handleChange={handleChange} options={tagsOptions} value={basicSettings.tags} />
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
