import { Button, Container, DataTable, Icon, IconButton, CheckboxFilter, Pagination, TextFilter, MultiSelectDropdownFilter, SearchField, DropdownButton, Dropdown, Form, Col, Modal, InputText, CardView, Card, ModalDialog, ActionRow } from '@edx/paragon';
import { useState, useEffect } from 'react';
import { Edit } from '@edx/paragon/icons';
import { useHistory } from "react-router-dom";
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';


const Programs = () => {
    const navigate = useHistory()
    const [data, setData] = useState([]);
    const [numPage, setNumPage] = useState(1)
    const page_size = 8
    const [pageCount, setPageCount] = useState(1)
    const [itemCount, setItemCount] = useState(0)
    const [searh, setSearch] = useState('')
    const [filterOpen, setFilterOpen] = useState(false)
    const [isActive, setIsActive] = useState(false)
    const [isPublished, setIsPublished] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)
    const [isRetired, setIsRetired] = useState(false)
    const [status, setStatus] = useState([])
    const [loading, setLoading] = useState(true);

    async function getPrograms(page) {
        const response = await getAuthenticatedHttpClient().get(process.env.DISCOVERY_BASE_URL + `/api/v1/program_data/?page=${page}&page_size=${page_size}&q=${searh}&status=${status}`);
        if (response.status == 200) {
            const response_data = response.data.results
            setData(response_data)
            setItemCount(response.data.count)
            setNumPage(page);
            setPageCount(response.data.num_pages)
            setLoading(false)

        }
    }
    useEffect(() => {
        getPrograms(1)
    }, [])

    useEffect(() => {
        const status_data = []
        if (isActive) {
            status_data.push("active")
        }

        if (isPublished) {
            status_data.push("unpublished")
        }

        if (isDeleted) {
            status_data.push("deleted")
        }

        if (isRetired) {
            status_data.push('retired')
        }
        setStatus(status_data)
    }, [isActive, isDeleted, isRetired, isPublished])

    const statusApply = () => {
        setLoading(true)
        getPrograms(1)
        setFilterOpen(false)
    }

    const CardData = ({ className, original }) => {
        return (
            <Card className="cardItem" onClick={() => { navigate.push(`/editProgram/${original.uuid}`, original) }}>
                <Card.ImageCap src={original.banner_image != null ? original.banner_image : "https://picsum.photos/360/200/"} srcAlt="Card image" />
                <Card.Header title={original.title} />

            </Card>
        );
    };


    return (
        <Container className="col-10">
            <div className='row searh-bar justify-content-between'>
                <SearchField
                    onChange={(val) => { setSearch(val) }}
                    onSubmit={value => { setLoading(true); getPrograms(1) }}
                />
                <Button className="filter-btn" onClick={() => setFilterOpen(true)}>
                    Filter
                </Button>
                <Button className='create-btn' onClick={() => navigate.push('/createProgram')}>
                    Create Program
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
                <CardView CardComponent={CardData} />
                {/* <DataTable.Table /> */}
                <DataTable.EmptyTable content="No results found" />

                <Pagination
                    paginationLabel="pagination navigation"
                    pageCount={pageCount}
                    currentPage={numPage}
                    onPageSelect={(page) => { setLoading(true); getPrograms(page) }}
                />
            </DataTable>
            <Modal
                open={filterOpen}
                title="Filter"
                body={
                    <div>
                        <p>Status</p>
                        <Form.Group>
                            <Form.Checkbox checked={isActive} onChange={() => { setIsActive(!isActive) }}>
                                Active
                            </Form.Checkbox>
                        </Form.Group>
                        <Form.Group>
                            <Form.Checkbox checked={isPublished} onChange={() => { setIsPublished(!isPublished) }}>
                                Unpublished
                            </Form.Checkbox>
                        </Form.Group>
                        <Form.Group>
                            <Form.Checkbox checked={isRetired} onChange={() => { setIsRetired(!isRetired) }}>
                                Retired
                            </Form.Checkbox></Form.Group>
                        <Form.Group>
                            <Form.Checkbox checked={isDeleted} onChange={() => { setIsDeleted(!isDeleted) }}>
                                Deleted
                            </Form.Checkbox></Form.Group>
                    </div>
                }
                onClose={() => { setFilterOpen(false); setIsActive(false); setIsPublished(false); setIsRetired(false); setIsDeleted(false) }}
                buttons={[
                    <Button data-autofocus onClick={statusApply}>Apply</Button>
                ]}
            />

        </Container >
    );
}


export default Programs;
