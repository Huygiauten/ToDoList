import React, { useContext, useState, useEffect } from "react";
import "../styles/notes.css";
import axios from '../util/axios.customize';
import { AuthContext } from "../components/context/auth.context";
import { DatePicker, Space, Input } from 'antd';

const { Search } = Input;

const NotesPage = () => {
  const { auth } = useContext(AuthContext); // Lấy thông tin người dùng
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState([]);
  const [originalNotes, setOriginalNotes] = useState([]); // Lưu danh sách gốc của ghi chú
  const [selectedNote, setSelectedNote] = useState(null);

  // Lấy danh sách ghi chú khi tải trang
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response1 = await axios.get(`/notes/${auth.user._id}`);
        const response2 = await axios.get(`/notes/groups/${auth.user.usersID}`);
        const combinedNotes = [...response1, ...response2];
        setNotes(combinedNotes);
        setOriginalNotes(combinedNotes); // Lưu danh sách gốc
      } catch (err) {
        console.log("Err: " + err);
      }
    };
    fetchNotes();
  }, []);

  // Hàm tìm kiếm ghi chú
  const handleSearchNotes = (value) => {
    if (value.trim() === "") {
      setNotes(originalNotes); // Khôi phục danh sách ban đầu nếu từ khóa rỗng
    } else {
      const filteredNotes = originalNotes.filter(note =>
        note.title.toLowerCase().includes(value.toLowerCase()) ||
        note.content.toLowerCase().includes(value.toLowerCase())
      );
      setNotes(filteredNotes);
    }
  };

  // Thêm một ghi chú mới
  const handleAddNote = async (event) => {
    event.preventDefault();
    try {
      const id = auth.user._id;
      const response = await axios.post("/notes", {
        title,
        content,
        id,
        date // Thêm ngày vào ghi chú
      });
      const newNote = response;
      setNotes([newNote, ...notes]); // Thêm ghi chú mới vào đầu danh sách
      setOriginalNotes([newNote, ...originalNotes]); // Cập nhật danh sách gốc
      setTitle("");
      setContent("");
    } catch (err) {
      console.log(err);
    }
  };

  // Xử lý khi nhấn vào ghi chú (để chỉnh sửa)
  const handleNoteClick = (note) => {
    if (note.userId === auth.user._id) {
      setSelectedNote(note);
      setTitle(note.title);
      setContent(note.content);
    }
  };

  // Cập nhật ghi chú
  const handleUpdateNote = async (event) => {
    event.preventDefault();
    if (!selectedNote) return;

    try {
      const response = await axios.put(`/notes/${selectedNote._id}`, {
        title,
        content,
        date
      });
      const updatedNote = response;

      setNotes(prevNotes => prevNotes.map(note =>
        note._id === selectedNote._id ? updatedNote : note
      ));
      setOriginalNotes(prevNotes => prevNotes.map(note =>
        note._id === selectedNote._id ? updatedNote : note
      ));

      setTitle("");
      setContent("");
      setSelectedNote(null);
    } catch (err) {
      console.log(err);
    }
  };

  // Hủy chỉnh sửa ghi chú
  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  // Xóa ghi chú
  const deleteNote = async (event, noteId, isUserNote) => {
    event.stopPropagation(); // Ngăn chặn kích hoạt sự kiện nhấn vào ghi chú
    if (isUserNote) { // Chỉ cho phép xóa ghi chú do người dùng tạo
      try {
        await axios.delete(`/notes/${noteId}`);
        const updatedNotes = notes.filter(note => note._id !== noteId);
        setNotes(updatedNotes);
        setOriginalNotes(updatedNotes); // Cập nhật danh sách gốc
      } catch (err) {
        console.log(err);
      }
    }
  };

  // Xử lý DatePicker
  const onChange = (date, dateString) => {
    setDate(date);
  };

  return (
    <div className="app-container" style={{ margin: 50 }}>
      {/* Thanh tìm kiếm ghi chú */}
      <Search
        placeholder="Search notes by title or content"
        enterButton
        onSearch={handleSearchNotes}
        style={{ marginBottom: 20 }}
      />

      <form className="note-form" onSubmit={(event) => (selectedNote ? handleUpdateNote(event) : handleAddNote(event))}>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Content"
          rows={10}
          required
        />
        <DatePicker
          value={date}
          onChange={onChange}
        />
        {selectedNote ? (
          <div className="edit-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <button type="submit">Add Note</button>
        )}
      </form>

      <div className="notes-grid">
        {notes.map((note) => {
          const isUserNote = note.userId === auth.user._id; // Kiểm tra nếu ghi chú được tạo bởi người dùng
          return (
            <div
              key={note._id}
              className="note-item"
              onClick={() => handleNoteClick(note)}
              style={{ cursor: isUserNote ? "pointer" : "default" }}
            >
              <div className="notes-header">
                {isUserNote && (
                  <button onClick={(event) => deleteNote(event, note._id, isUserNote)}>x</button>
                )}
                {!isUserNote && <span className="note-admin-label">Admin Note</span>}
              </div>

              <div className="notes-body">
                <h2>{note.title}</h2>
                <p className="notes-content">{note.content}</p>
              </div>

              <div className="notes-footer">
                <p className="notes-date">{new Date(note.date).toLocaleDateString()}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotesPage;
