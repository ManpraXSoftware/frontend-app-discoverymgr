import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { Container, Row, Tab, Tabs } from '@edx/paragon';
import React, { useEffect, useState } from 'react';
import BasicSettings from './BasicSettings';
import AdvancedSettings from './AdvancedSettings';
import ScheduleSettings from './ScheduleSettings';
import CertificateSettings from './CertificateSettings';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Loader from '../../Shared/Loader';


const CourseEdit = (props) => {
    const params = useParams();
    const [settings, setSettings] = useState({})
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getAuthenticatedHttpClient().get(`${process.env.DISCOVERY_BASE_URL}/api/v1/course_runs/${params.course_id}/?editable=1`).then(
            res => res.data).then(data => {
                setSettings(data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false)
            });
    }, [])
    return <Container>
        <Loader hidden={!loading} />
        <Row as={Container} className='justify-content-between mt-5'><h1>Edit Course</h1></Row>
        <Tabs
            defaultActiveKey="basic"
            id="uncontrolled-pills-tab"
            variant="pills"
        >
            <Tab eventKey="basic" title="Basic">
                <BasicSettings settings={settings} course_id={params.course_id} setLoading={setLoading} />
            </Tab>
            <Tab eventKey="schedule" title="Schedule">
                <ScheduleSettings settings={settings} course_id={params.course_id} setLoading={setLoading} />
            </Tab>
            <Tab eventKey="advanced" title="Advanced">
                <AdvancedSettings settings={settings} course_id={params.course_id} setLoading={setLoading} />
            </Tab>
            <Tab eventKey="certificate" title="Certificate">
                <CertificateSettings settings={settings} course_id={params.course_id} setLoading={setLoading} />
            </Tab>
        </Tabs>
    </Container>
}

export default CourseEdit;
