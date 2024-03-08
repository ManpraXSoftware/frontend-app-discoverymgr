import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { ActionRow, AlertModal, Button, Container, Form, Row } from '@edx/paragon';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Loader from '../Shared/Loader';

const CourseCreate = (props) => {
    const search = useLocation().search;
    const queryParams = new URLSearchParams(search);
    // const [sourceCourseKey, setSourceCourseKey] = useState("");
    const sourceCourseKey = queryParams.get("source") || props.source;
    const [source, setSource] = useState(null);
    const [creating, setCreating] = useState(false);
    const [studioData, setStudioData] = useState({ org: "", number: "", display_name: "", run: "" });
    const [alertData, setAlertData] = useState({ isOpen: false, message: "", title: "", variant: "" })
    const history = useHistory();
    const [organizations, setOrganizations] = useState([{}]);
    useEffect(() => {
        if (sourceCourseKey) {
            getAuthenticatedHttpClient().get(`${process.env.CMS_BASE_URL}/api/v1/course_runs/${sourceCourseKey}/`)
                .then((res) => {
                    setStudioData({
                        org: sourceCourseKey.split(":")[1].split("+")[0],
                        number: sourceCourseKey.split(":")[1].split("+")[1],
                        display_name: res.data.title,
                        source_course_key: sourceCourseKey
                    });
                    setSource({
                        org: sourceCourseKey.split(":")[1].split("+")[0],
                        number: sourceCourseKey.split(":")[1].split("+")[1],
                        ...res.data,
                    });

                })
                .catch(() => {
                    setSource(null);
                    queryParams.delete('source');
                    history.replace({
                        search: queryParams.toString(),
                    });
                });
        }
        else {
            getAuthenticatedHttpClient().get(`${process.env.LMS_BASE_URL}/api/organizations/v0/organizations/`).then((res) => { setOrganizations(res.data.results) })
        }

    }, [sourceCourseKey])
    const syncToDiscovery = (id) => {
        getAuthenticatedHttpClient().get(`${process.env.DISCOVERY_BASE_URL}/api/mx/sync_course/${id}/`);
    }
    const createCourse = (e) => {
        e.preventDefault();
        setCreating(true);

        getAuthenticatedHttpClient().post(`${process.env.CMS_BASE_URL}/course/`, studioData)
            .then((res) => res.data.course_key)
            .then((id) => syncToDiscovery(id))
            .then(() => setAlertData({ ...alertData, isOpen: true, message: "Course Created", title: "Success", variant: "success" }))
            .catch((error) => setAlertData({ ...alertData, isOpen: true, message: error.message, title: "Error", variant: "danger" }))
            .finally(() => setCreating(false));

    }

    const handleChange = (e, val = null) => {
        if (val != null) {
            setStudioData({ ...studioData, [e]: val });
        }
        else {
            e.preventDefault();
            setStudioData({ ...studioData, [e.target.name]: e.target.value });
        }


    }
    return <Container>
        <Loader hidden={!creating} />
        <AlertModal
            title={alertData.title}
            isOpen={alertData.isOpen}
            onClose={() => { setAlertData({ ...alertData, isOpen: false }) }}
            variant={alertData.variant}
            // icon={CheckCircle}
            footerNode={(
                <ActionRow>
                    <Button variant={alertData.variant} onClick={() => { setAlertData({ ...alertData, isOpen: false }) }}>OK</Button>
                </ActionRow>
            )}
        >
            <p>
                {alertData.message}
            </p>
        </AlertModal>
        {!props.compact && <Row as={Container} className='justify-content-between mt-5'><h1>Create New Course</h1></Row>}
        <Form onSubmit={createCourse}>

            <Form.Group controlId="formGridCourseName">
                <Form.Control name='display_name' floatingLabel="Course Name*" disabled={source ? true : false} value={studioData.display_name} onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="formGridOrganization">
                <Form.Autosuggest isSelectionRequired={false} name='org' floatingLabel="Organization*" disabled={source ? true : false} value={studioData.org} onChange={(val) => handleChange("org", val)} >
                    {organizations.map((value, index) => <Form.AutosuggestOption id={value.name}>{value.name}</Form.AutosuggestOption>)}
                </Form.Autosuggest>
                {/* <Form.Control name='org' floatingLabel="Organization*" disabled={source ? true : false} value={studioData.org} onChange={handleChange} /> */}
            </Form.Group>

            <Form.Group controlId="formGridCourseNumber" isValid>
                <Form.Control name='number' floatingLabel="Course Number*" disabled={source ? true : false} value={studioData.number} onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="formGridCourseRun">
                <Form.Control name='run' floatingLabel="Course Run*" value={studioData.run} onChange={handleChange} />
            </Form.Group>

            <div className="d-flex">
                <Button variant="primary" type="submit" disabled={creating}>
                    Submit
                </Button>
            </div>
        </Form>

    </Container>
}

export default CourseCreate;
