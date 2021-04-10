import TimeAgo from 'react-timeago'
import { ListGroup, Card } from 'react-bootstrap'

export const MessageListItem = ({ msg }) => {

  const {messageText, senderName, createdAt, currentUser } = msg
  return (
    <ListGroup.Item
      className={`d-flex ${currentUser ? 'justify-content-end' : ''}`}
    >
      <Card
        bg={`${currentUser ? 'dark' : 'secondary'}`}
        text='light'
        style={{ width: '55%' }}
      >
        <Card.Header className='d-flex justify-content-between align-items-center'>
          <Card.Text as={TimeAgo} date={createdAt} className='small' />
          <Card.Text>{senderName}</Card.Text>
        </Card.Header>
        <Card.Body className='d-flex justify-content-between align-items-center'>
          <Card.Text>{messageText}</Card.Text>
        </Card.Body>
      </Card>
    </ListGroup.Item>
  )
}