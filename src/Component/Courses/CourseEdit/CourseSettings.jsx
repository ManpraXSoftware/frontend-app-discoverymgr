import { Button, Container, Form, FormAutosuggest, FormAutosuggestOption, Row } from '@edx/paragon';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import WysiwygEditor from '../../Shared/InputFields/Wysiwyg';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import MultipleSelect from '../../Shared/InputFields/MultipleSelect';


const CourseSettings = ({ settings, course_id, setLoading, showToast }) => {

    const { subjects, prerequisites_raw, syllabus_raw, faq, learner_testimonials } = settings;
    const image = { src: settings.image ? settings.image.src : '' };
    const [subjectOptions, setSubjectOptions] = useState([])
    const [courseSettings, setCourseSettings] = useState({
        subjects: subjects ? subjects.map((x, i) => x.slug) : [],
        prerequisites_raw: prerequisites_raw || "",
        syllabus_raw: syllabus_raw || "",
        image: image || { src: "" },
        faq: faq || "",
        learner_testimonials: learner_testimonials || "",
    });
    useEffect(() => {
        getAuthenticatedHttpClient()
            .get(`${process.env.DISCOVERY_BASE_URL}/api/v1/subjects/`)
            .then(res => res.data)
            .then(
                data => {

                    setSubjectOptions(data.results.map(c => {
                        return { value: c.slug, label: c.name }
                    }));
                }
            )
    }, [])
    const handleChange = (e) => {
        const fieldName = e.target.name;
        let value = e.target.value;
        if (fieldName === "image")
            value = { ...courseSettings.image, src: e.target.value };
        setCourseSettings({ ...courseSettings, [fieldName]: value });
    }

    const updateCourse = (e) => {
        e.preventDefault();
        setLoading(true);
        getAuthenticatedHttpClient().patch(`${process.env.DISCOVERY_BASE_URL}/api/v1/courses/${course_id}/`, courseSettings)
            .then((res) => {
                showToast("Course Settings Updated", res.status, res.statusText)
            })
            .catch((error) => {
                showToast("An error occured while updating course settings.", error.code);
            });
    }
    return <Container>
        <Row as={Container} className='justify-content-between mt-5'><h1>Course Settings</h1></Row>
        <Form onSubmit={updateCourse}>

            <Form.Group >
                <Form.Label >Subjects</Form.Label>
                <MultipleSelect handleChange={handleChange} name='subjects' options={subjectOptions} value={courseSettings.subjects} />
            </Form.Group>

            <Form.Group >
                <Form.Label >Prerequisites raw</Form.Label>
                <Form.Control as={WysiwygEditor} value={courseSettings.prerequisites_raw} name='prerequisites_raw' initialValue={courseSettings.prerequisites_raw || ""} onChange={(val) => handleChange({ target: { name: "prerequisites_raw", value: val } })} />
            </Form.Group>

            <Form.Group >
                <Form.Label >Syllabus Raw</Form.Label>
                <Form.Control as={WysiwygEditor} value={courseSettings.syllabus_raw} name='syllabus_raw' initialValue={courseSettings.syllabus_raw || ""} onChange={(val) => handleChange({ target: { name: "syllabus_raw", value: val } })} />
            </Form.Group>

            <Form.Group >
                <Form.Label >Image</Form.Label>
                <Form.Control name='image' value={courseSettings.image.src} onChange={handleChange} />
            </Form.Group>

            <Form.Group >
                <Form.Label >FAQ</Form.Label>
                <Form.Control as={WysiwygEditor} value={courseSettings.faq} name='faq' initialValue={courseSettings.faq || ""} onChange={(val) => handleChange({ target: { name: "faq", value: val } })} />
            </Form.Group>

            <Form.Group >
                <Form.Label >Learner Testimonials</Form.Label>
                <Form.Control as={WysiwygEditor} value={courseSettings.learner_testimonials} name='learner_testimonials' initialValue={courseSettings.learner_testimonials || ""} onChange={(val) => handleChange({ target: { name: "learner_testimonials", value: val } })} />
            </Form.Group>

            <div className="d-flex">
                <Button variant="primary" type="submit">
                    Update
                </Button>
            </div>
        </Form>
    </Container>
}

export default CourseSettings;
