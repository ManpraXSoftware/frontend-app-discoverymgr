import { Button, Container, DataTable, Icon, IconButton, CheckboxFilter, Pagination, TextFilter, MultiSelectDropdownFilter, SearchField, DropdownButton, Dropdown, Form, Col, Modal, InputText, CardView, Card, ModalDialog, ActionRow, Toast } from '@edx/paragon';
import { useState, useEffect } from 'react';
import { Edit } from '@edx/paragon/icons';
import { useHistory } from "react-router-dom";
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import CardData from './cardData';



const Degrees = () => {
    const navigate = useHistory()
    const [data, setData] = useState([]);
    const [numPage, setNumPage] = useState(1)
    const page_size = 8
    const [pageCount, setPageCount] = useState(1)
    const [itemCount, setItemCount] = useState(0)
    const [searh, setSearch] = useState('')
    const [filterOpen, setFilterOpen] = useState(false)
    const [isActive, setIsActive] = useState(false)
    const [isUnpublished, setIsUnpublished] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)
    const [isRetired, setIsRetired] = useState(false)
    const [status, setStatus] = useState([])
    const [loading, setLoading] = useState(true)
    const [createModal, setCreateModal] = useState(false)
    const [errors, setErrors] = useState({});
    const [types, setTypes] = useState([]);
    const [successMessage, setSuccessMessage] = useState(false)

    async function getDegrees(page) {
        const response = await getAuthenticatedHttpClient().get(process.env.DISCOVERY_BASE_URL + `/api/v1/degree/?page=${page}&page_size=${page_size}&q=${searh}&status=${status}`);
        if (response.status == 200) {
            const response_data = response.data.results
            setData(response_data)
            setItemCount(response.data.count)
            setNumPage(page);
            setPageCount(response.data.num_pages)
            setLoading(false)

        }
    }
    async function getProgramTypes() {
        const response = await getAuthenticatedHttpClient().get(process.env.DISCOVERY_BASE_URL + '/api/v1/program_types');
        if (response.status == 200) {
            const response_data = response.data.results
            setTypes(response_data)
        }
    }

    useEffect(() => {
        getDegrees(1)
        getProgramTypes()
    }, [])

    useEffect(() => {
        const status_data = []
        if (isActive) {
            status_data.push("active")
        }

        if (isUnpublished) {
            status_data.push("unpublished")
        }

        if (isDeleted) {
            status_data.push("deleted")
        }

        if (isRetired) {
            status_data.push('retired')
        }
        setStatus(status_data)
    }, [isActive, isDeleted, isRetired, isUnpublished])

    const statusApply = () => {
        setLoading(true)
        getDegrees(1)
        setFilterOpen(false)
    }

    const createDegree = async (e) => {
        e.preventDefault()
        const form_data = new FormData(e.target)
        getAuthenticatedHttpClient().post(process.env.DISCOVERY_BASE_URL + '/api/v1/degree/', form_data).then(
            (res) => {
                if (res.status == 201) {
                    navigate.push('/degrees')
                    setSuccessMessage(true)
                    setCreateModal(false)
                    getDegrees(1)
                }
            })
            .catch((err) => {
                setErrors(err.response.data)
            })
        // }
    }

    const searchChange = (val) => {
        setSearch(val)
    }

    return (
        <Container className="col-10">
            <div className='row search-bar'>
                <SearchField
                    onChange={searchChange}
                    onSubmit={(value) => { setSearch(value); getDegrees(1) }}
                />
                <Button className="search-btn" onClick={(e) => { e.preventDefault(); getDegrees(1) }}>
                    Search
                </Button>
                <Button className="filter-btn" onClick={() => setFilterOpen(true)}>
                    Filter
                </Button>
                <Button className='create-btn' onClick={() => { setCreateModal(true) }}>
                    Create Degree
                </Button>
            </div>
            <DataTable
                isLoading={loading}
                additionalColumns={[
                    {
                        id: 'action',
                        Header: 'Action',
                        Cell: ({ row }) => <IconButton src={Edit} iconAs={Icon} alt="Close" onClick={() => { navigate.push(`/editProgram/${row.original.uuid}`, row.original) }} className="mr-2" />,
                    }
                ]}
                itemCount={itemCount}
                data={data}
                columns={[
                    {
                        Header: 'UUID',
                        accessor: 'uuid',

                    },
                    {
                        Header: 'Title',
                        accessor: 'title',
                    },
                    {
                        Header: 'Type',
                        accessor: 'type.name',
                    },
                    {
                        Header: 'Status',
                        accessor: 'status',
                    },
                ]}
            >
                <CardView CardComponent={CardData}/>
                {/* <DataTable.Table /> */}
                <DataTable.EmptyTable content="No results found" />

                <Pagination
                    paginationLabel="pagination navigation"
                    pageCount={pageCount}
                    currentPage={numPage}
                    onPageSelect={(page) => { setLoading(true); getDegrees(page) }}
                />
            </DataTable>
            <ModalDialog
                open={filterOpen}
                title="Filter"
                isOpen={filterOpen}
                onClose={() => { setFilterOpen(false) }}
                size="md"
                variant="default"
                hasCloseButton
                isFullscreenOnMobile
            >
                <ModalDialog.Header>
                    <ModalDialog.Title>
                        Select Status
                    </ModalDialog.Title>
                </ModalDialog.Header>
                <ModalDialog.Body>
                    <Form onSubmit={statusApply}>
                        <Form.Group>
                            <Form.Checkbox name="active" checked={isActive} onChange={() => { setIsActive(!isActive) }}>
                                Active
                            </Form.Checkbox>
                        </Form.Group>
                        <Form.Group>
                            <Form.Checkbox name='unpublish' checked={isUnpublished} onChange={() => { setIsUnpublished(!isUnpublished) }}>
                                Unpublished
                            </Form.Checkbox>
                        </Form.Group>
                        <Form.Group>
                            <Form.Checkbox name="retired" checked={isRetired} onChange={() => { setIsRetired(!isRetired) }}>
                                Retired
                            </Form.Checkbox></Form.Group>
                        <Form.Group>
                            <Form.Checkbox name='deleted' checked={isDeleted} onChange={() => { setIsDeleted(!isDeleted) }}>
                                Deleted
                            </Form.Checkbox></Form.Group>
                            <div className="d-flex submit-btn">
                            <Button variant="primary" type="submit">
                                Apply
                            </Button>
                        </div>
                    </Form>
                </ModalDialog.Body>
            </ModalDialog>

            <ModalDialog
                title="My dialog"
                isOpen={createModal}
                onClose={() => { setCreateModal(false);setErrors({}) }}
                size="md"
                variant="default"
                hasCloseButton
                isFullscreenOnMobile
            >
                <ModalDialog.Header>
                    <ModalDialog.Title>
                        Create Degree
                    </ModalDialog.Title>

                </ModalDialog.Header>

                <ModalDialog.Body>
                    <Form onSubmit={createDegree}>
                        <Form.Row>
                            <Form.Group as={Col} controlId="title">
                                <Form.Label>Title*</Form.Label>
                                <Form.Control name='title' type="text" placeholder="Enter Degree Title" />
                                {errors.title ?
                                    <Form.Control.Feedback type="invalid">
                                        {errors.title}
                                    </Form.Control.Feedback> : ""}
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="subtitle">
                                <Form.Label>Subtitle</Form.Label>
                                <Form.Control name='subtitle' type='text' placeholder='Enter Degree Subtitle' />
                                {errors.subtitle ?
                                    <Form.Control.Feedback type="invalid">
                                        {errors.subtitle}
                                    </Form.Control.Feedback> : ""}
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="type">
                                <Form.Label>Type*</Form.Label>
                                <Form.Control name='type' as="select">
                                    {types.map((item) => { return (<option value={item.id}>{item.name}</option>) })}
                                </Form.Control>
                                {errors.type ?
                                    <Form.Control.Feedback type="invalid">
                                        {errors.type}
                                    </Form.Control.Feedback> : ""}
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="marketing_slug">
                                <Form.Label>Marketing Slug*</Form.Label>
                                <Form.Control name='marketing_slug' type='text' placeholder='Enter Marketing Slug' />
                                {errors.marketing_slug ?
                                    <Form.Control.Feedback type="invalid">
                                        {errors.marketing_slug}
                                    </Form.Control.Feedback> : ""}
                            </Form.Group>
                        </Form.Row>

                        <div className="d-flex submit-btn">
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>

                </ModalDialog.Body>
            </ModalDialog>
            <Toast
                onClose={() => setSuccessMessage(false)}
                show={successMessage}
                delay={2000}
            >
                Degree created.
            </Toast>

        </Container >
    );
}


export default Degrees;
