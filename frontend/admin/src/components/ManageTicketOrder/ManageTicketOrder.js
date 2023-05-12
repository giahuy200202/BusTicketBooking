import styles from "./ManageTicketOrder.module.css";
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ManageTicketOrderItem from "./ManageTicketOrderItem/ManageTicketOrderItem";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import axios from "axios";



const ManageTicketOrder = () => {

  const [ticketHistory, setTicketHistory] = useState([])

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_HOST + '/admin/ticket-history/ticketHistory').then((res) => {
      // console.log(res.data.data.ticketHistory)
      setTicketHistory(res.data.data.ticketHistory)
    }).catch(error => {
      console.log(error)
    })
  }, [])

  const socket = io(process.env.REACT_APP_ipAddress)

  useEffect(() => {
    socket.on("book-ticket", (data) => {
      setTicketHistory(prev => [...prev, data])
    });
  }, [])

  const [detail, setDetail] = useState(false)
  const [currentData, setCurrentData] = useState()
  const navigate = useNavigate()

  const showDetail = (id) => {
    axios.get(process.env.REACT_APP_API_HOST + '/admin/ticket-history/ticketHistory').then((res) => {
      setCurrentData(res.data.data.ticketHistory.filter(el => el.id === id)[0])
      setDetail(true)
    }).catch(error => {
      console.log(error)
    })
  }

  const editData = () => {
    navigate("edit/" + currentData.id, { state: currentData })
  }

  const [search, setSearch] = useState()
  const handleChangeSearch = (e) => {
    setSearch(e.target.value)
  }

  const handleSearch = () => {
    axios.patch(process.env.REACT_APP_API_HOST + '/admin/ticket-history/searchTicketHistory', { search: search }).then((res) => {
      setTicketHistory(res.data.data.ticket_history_filter)
    }).catch(error => {
      console.log(error)
    })
  }

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  };


  return <div className={styles.ManageTicketOrder}>
    <div className={styles['main-content']}>
      <p className={styles.title}>vé xe đã đặt</p>
      <div className={styles.search}>
        <input onKeyDown={(e) => handleKeyUp(e)} onChange={handleChangeSearch} placeholder="Tìm kiếm..." />
        <FontAwesomeIcon onClick={handleSearch} className={styles.icon} icon={faMagnifyingGlass} style={{ color: '#737B83', fontSize: '2.1rem' }} />
      </div>
      <div className={styles.table}>
        <div className={styles.header}>
          <p>#</p>
          <p>Tên</p>
          <p>Số điện thoại</p>
          <p>Tuyến</p>
          <p>Thời gian đặt vé</p>
          <p>Trạng thái</p>
        </div>
        <div className={styles.listItem}>
          {ticketHistory.map((value, index) => (
            <ManageTicketOrderItem key={index} index={index + 1} value={value} showDetail={showDetail} />
          ))}
        </div>
      </div>
      {detail && <div className={styles.detail}>
        <div onClick={() => setDetail(false)} className={styles.overlay}>
        </div>
        <div className={styles.popup}>
          <FontAwesomeIcon onClick={() => setDetail(false)} className={styles.closeIcon} icon={faXmark} style={{ color: '#083F73', fontSize: '3.6rem' }} />
          <button onClick={editData} className={styles.editBtn}>Sửa</button>
          <div className={styles.left}>
            <p>Tên: {currentData.guestInfo.name}</p>
            <p>Thời gian đặt vé: {currentData.time} {new Date(currentData.date).toLocaleDateString('en-GB').toString()}</p>
            <p>Thời gian khởi hành: {currentData.time_start} {new Date(currentData.date_start).toLocaleDateString('en-GB').toString()}</p>
            <p>Điểm khởi hành: {currentData.departure_city}</p>
            <p>Điểm nhận vé: {currentData.depot_address}</p>
            <p style={{ color: "#FF0000" }}>Tổng tiền: {currentData.total_price}</p>
          </div>
          <div className={styles.right}>
            <p>Số điện thoại: {currentData.guestInfo.phoneNumber}</p>
            <p>Số lượng ghế: {currentData.number_of_seats}</p>
            <p className={styles['chosen-seat']}>Số ghế: &nbsp;
              {currentData.chosen_seats.map((value, index) => (
                <p>{value} &nbsp;</p>
              ))}</p>
            <p>Điểm đến: {currentData.arrival_city}</p>
            <p>Trạng thái: {currentData.stage}</p>
          </div>
        </div>
      </div>}
    </div>
  </div>
}

export default ManageTicketOrder;