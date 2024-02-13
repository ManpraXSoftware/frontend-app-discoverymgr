import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { Button, Col, Container, Form } from '@edx/paragon';
import { useState, useEffect } from 'react';
import React from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const CreateProgram = () => {
    const [types, setTypes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [showOption, setShowOption] = useState(false);
    const [partners, setPartners] = useState([])
    const animatedComponents = makeAnimated();
    const navigate = useHistory()
    const [errors, setErrors] = useState({})

    useEffect(() => {
        async function getProgramTypes() {
            const response = await getAuthenticatedHttpClient().get(process.env.DISCOVERY_BASE_URL + '/api/v1/program_types');
            if (response.status == 200) {
                const response_data = response.data.results
                setTypes(response_data)
            }
        }
        async function getCourses() {
            const response = await getAuthenticatedHttpClient().get(process.env.DISCOVERY_BASE_URL + '/api/v1/courses');
            if (response.status == 200) {
                const response_data = response.data.results
                setCourses(response_data)
            }
        }
        async function getParterns() {
            const response = await getAuthenticatedHttpClient().get(process.env.DISCOVERY_BASE_URL + '/api/v1/partners');
            if (response.status == 200) {
                const response_data = response.data.results
                setPartners(response_data)
            }
        }
        getProgramTypes()
        getCourses()
        getParterns()
    }, [])

    const options = []
    courses.forEach((value, index) => {
        options.push({ "value": value.id, "label": value.key + ":" + value.title })
    })

    const CreateProgram = async (e) => {
        e.preventDefault()
        if (e.target.title.value == "") {
            setErrors({ "title": "This field is required." })
        }
        else if (e.target.marketing_slug.value == "") {
            setErrors({ "marketing_slug": "This field is required." })
        }
        else if (e.target.partner.value == "") {
            setErrors({ "partner": "This field is required." })
        }
        else if (e.target.type.value == "") {
            setErrors({ "type": "This field is required." })
        }
        else if (e.target.courses.value == "") {
            setErrors({ "courses": "This field is required." })
        }
        else {
            const form_data = new FormData(e.target)
            getAuthenticatedHttpClient().post(process.env.DISCOVERY_BASE_URL + '/api/v1/program_data/', form_data).then(
                (res) => {
                    if (res.status == 201) {
                        navigate.push('/programs')
                    }
                })
                .catch((err) => {
                    setErrors(err.response.data)
                })
        }
    }

    return (
        <Container className="col-10">
            <h2>Create Program</h2>
            <Form onSubmit={CreateProgram}>
                <Form.Row>
                    <Form.Group as={Col} controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control name='title' type="text" placeholder="Enter Program Title" />
                        {errors.title ?
                            <Form.Control.Feedback type="invalid">
                                {errors.title}
                            </Form.Control.Feedback> : ""}
                    </Form.Group>
                    <Form.Group as={Col} controlId="marketing-slug">
                        <Form.Label>Marketing Slug</Form.Label>
                        <Form.Control name='marketing_slug' />
                        {errors.marketing_slug ?
                            <Form.Control.Feedback type="invalid">
                                {errors.marketing_slug}
                            </Form.Control.Feedback> : ""}
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} controlId="partner">
                        <Form.Label>Partner</Form.Label>
                        <Form.Control name='partner' as="select">
                            <option value="">--------</option>
                            {partners.map((item) => { return (<option value={item.id}>{item.name}</option>) })}
                        </Form.Control>
                        {errors.partner ?
                            <Form.Control.Feedback type="invalid">
                                {errors.partner}
                            </Form.Control.Feedback> : ""}
                    </Form.Group>
                    <Form.Group as={Col} controlId="type">
                        <Form.Label>Type</Form.Label>
                        <Form.Control name='type' as="select">
                            <option value="">--------</option>
                            {types.map((item) => { return (<option value={item.id}>{item.name}</option>) })}
                        </Form.Control>
                        {errors.type ?
                            <Form.Control.Feedback type="invalid">
                                {errors.type}
                            </Form.Control.Feedback> : ""}
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} controlId="courses">
                        <Form.Label>Courses</Form.Label>
                        <Select name='courses'
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            isMulti
                            options={showOption ? options : []}
                            onInputChange={(e) => { e.length > 2 ? setShowOption(true) : setShowOption(false) }}
                        />
                        {errors.courses ?
                            <Form.Control.Feedback type="invalid">
                                {errors.courses}
                            </Form.Control.Feedback> : ""}
                    </Form.Group>
                </Form.Row>
                <div className="d-flex">
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </div>
            </Form>

        </Container>
    )
};

export default CreateProgram;
