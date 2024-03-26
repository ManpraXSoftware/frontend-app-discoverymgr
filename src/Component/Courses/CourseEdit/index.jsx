import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform'
import { Container, Row, Tab, Tabs, Toast } from '@edx/paragon';
import React, { useEffect, useState } from 'react';
import BasicSettings from './BasicSettings';
import AdvancedSettings from './AdvancedSettings';
import ScheduleSettings from './ScheduleSettings';
import CourseSettings from './CourseSettings';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Loader from '../../Shared/Loader';


const CourseEdit = (props) => {
    const params = useParams();
    const [courseRunSettings, setCourseRunSettings] = useState({});
    const [courseSettings, setCourseSettings] = useState({})
    const [loading, setLoading] = useState(false);
    const { DISCOVERY_BASE_URL } = getConfig();
    const [toast, setToast] = useState({ message: "", show: false, status: 200, statusText: "" })
    const showToast = (message, toastStatus = 200, toastStatusText = "") => {
        setToast({ message: message, show: true, status: toastStatus, statusText: toastStatusText });
        setLoading(false);
    }
    const courseId = params.course_id;
    const courseKey = courseId.split(':')[1].split('+').slice(0, 2).join('+');

    useEffect(() => {
        setLoading(true);
        getAuthenticatedHttpClient()
            .get(`${process.env.DISCOVERY_BASE_URL}/api/mx/course_runs/${courseId}/?editable=1`)
            .then(res => res.data)
            .then(
                data => {
                    setCourseRunSettings(data);
                }
            )
            .catch(
                error => showToast("Failed to get course run details", error.customAttributes.httpErrorStatus, error.code)
            ).finally(() => {
                setLoading(true);
                getAuthenticatedHttpClient()
                    .get(`${process.env.DISCOVERY_BASE_URL}/api/v1/courses/${courseKey}/?editable=1`)
                    .then(res => res.data)
                    .then(
                        data => {
                            setCourseSettings(data);
                            setLoading(false);
                        }
                    )
                    .catch(
                        error => showToast("Failed to get course details", error.customAttributes.httpErrorStatus, error.code)
                    );
            })

    }, [])
    return <Container>

        <Toast
            onClose={() => setToast({ message: "", show: false, status: "", statusText: "" })}
            show={toast.show}
        >
            {toast.status} : {toast.statusText}
            <br />
            {toast.message}
        </Toast>
        <Row as={Container} className='justify-content-between mt-5'><h1>Edit Course</h1></Row>
        <Loader hidden={!loading} />
        <Tabs
            hidden={loading}
            defaultActiveKey="basic"
            id="uncontrolled-pills-tab"
            variant="pills"
        >
            <Tab eventKey="basic" title="Basic" hidden={loading}>
                <BasicSettings settings={courseRunSettings} course_id={params.course_id} setLoading={setLoading} showToast={showToast} />
            </Tab>
            <Tab hidden={loading} eventKey="schedule" title="Schedule">
                <ScheduleSettings settings={courseRunSettings} course_id={params.course_id} setLoading={setLoading} showToast={showToast} />
            </Tab>
            <Tab hidden={loading} eventKey="advanced" title="Advanced">
                <AdvancedSettings settings={courseRunSettings} course_id={params.course_id} setLoading={setLoading} showToast={showToast} />
            </Tab>
            <Tab hidden={loading} eventKey="course" title="Course">
                <CourseSettings settings={courseSettings} course_id={courseKey} setLoading={setLoading} showToast={showToast} />
            </Tab>
        </Tabs>
    </Container>
}

export default CourseEdit;
