import { useMutation, useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { Table as BTable } from 'react-bootstrap'
import DeleteModal from '../DeleteModal/DeleteModal'
import Loading from '../Loading/Loading'
import Unauthorized from '../Unauthorized/Unauthorized'
import { ListRow } from './Row'

export const Table = ({ filter, name, adminMode = false, queries, fields, onEdit, getEditLink }) => {
  const [unauthorized, setUnauthorized] = useState(false)
  const [deleteObject, setDeleteObject] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingOnDeleteDialog, setDeletingOnDeleteDialog] = useState(false)

  const [data, setData] = useState([])
  const [error, setError] = useState()

  const { refetch: userRefetch, loading } = useQuery(adminMode ? queries.ADMIN_LIST_QUERY : queries.USER_LIST_QUERY, {
    onError: (e) => {
      if (e.message === 'GraphQL error: Unauhorized') {
        setUnauthorized(true)
      } else {
        setError(e)
      }
    },
    onCompleted: (d) => {
      const dataFields = Object.getOwnPropertyNames(d)
      if (dataFields.length > 0 && d[dataFields[0]].length > 0) {
        setData(d[dataFields[0]])
      } else {
        setData([])
      }
    },
    variables: { filter },
  })

  const [deleteProjectMutation] = useMutation(queries.DELETE_MUTATION, {
    errorPolicy: 'none',
    onCompleted: (data) => {
      onHideDidaloDelete()
      userRefetch()
    },
    onError: (e) => {
      if (e.message === 'GraphQL error: Unauhorized') {
        setUnauthorized(true)
      }
    },
  })

  const onHideDidaloDelete = () => {
    setShowDeleteDialog(false)
    setDeleteObject(null)
  }

  const onDelete = (obj) => {
    setDeletingOnDeleteDialog(false)
    setShowDeleteDialog(true)
    setDeleteObject(obj)
  }

  const doDelete = (deleteObject) => {
    setDeletingOnDeleteDialog(true)
    deleteProjectMutation({
      variables: {
        id: deleteObject.id,
      },
    })
  }

  if (unauthorized) {
    return <Unauthorized where={name} />
  }
  if (loading) return <Loading what={name} />

  return (
    <div>
      {error && <div>{`Error! ${error.message}`}</div>}

      <BTable responsive>
        <thead>
          <tr>
            <th>Id</th>
            {fields?.map((f) => f !== 'id' && <th>{(f).name ? (f).name : f}</th>)}
            {adminMode && <th>User</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.length &&
            data.map((projectItem) => (
              <ListRow name={name} item={projectItem} onDelete={onDelete} fields={fields} showDelete={adminMode} onEdit={onEdit} getEditLink={getEditLink} />
            ))}
        </tbody>
      </BTable>

      <DeleteModal
        show={showDeleteDialog}
        onHide={onHideDidaloDelete}
        onDelete={doDelete}
        modelName={name}
        deleteObject={deleteObject}
        deleting={deletingOnDeleteDialog}
      />
    </div>
  )
}

export default Table
