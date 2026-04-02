import { useState, useEffect, useRef } from "react";
import { Modal, Spinner, TextInput} from "flowbite-react";
import { HiOutlineChatAlt2, HiPaperAirplane, HiTrash, HiLockClosed, HiDotsVertical } from "react-icons/hi";
import { getConversation, sendMessage, getCurrentUser, deleteConversation } from "../services/api";

export default function DirectChatModal({ show, onClose, targetUserId, targetName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); 
  const messagesEndRef = useRef(null);

  useEffect(() => {
    let interval;
    if (show && targetUserId) {
      const fetchMessages = async () => {
        try {
          if (!currentUser) {
            const me = await getCurrentUser();
            setCurrentUser(me);
          }
          const chatHistory = await getConversation(targetUserId);
          setMessages(chatHistory);
        } catch (error) { console.error("Erreur de chat", error); }
        finally { setIsLoading(false); }
      };

      setIsLoading(true);
      fetchMessages();
      interval = setInterval(fetchMessages, 3000);
    }
    return () => clearInterval(interval);
  }, [show, targetUserId, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !targetUserId) return;
    try {
      const sentMsg = await sendMessage(targetUserId, newMessage);
      setMessages([...messages, sentMsg]);
      setNewMessage("");
    } catch (error) { console.error(error); }
  };

  const handleCloseChat = async () => {
    if (window.confirm("Voulez-vous vraiment clôturer cette conversation ? Le candidat ne pourra plus répondre.")) {
      try {
        await sendMessage(targetUserId, "__CHAT_CLOSED__");
        setMessages([...messages, { content: "__CHAT_CLOSED__", sender: currentUser.id }]);
      } catch (error) { console.error(error); }
    }
  };

  const handleDeleteChat = async () => {
    if (window.confirm("Voulez-vous DÉFINITIVEMENT supprimer cet historique pour vous et le candidat ?")) {
      try {
        await deleteConversation(targetUserId);
        setMessages([]);
        onClose(); 
      } catch (error) { console.error(error); }
    }
  };

  const isClosed = messages.some(m => m.content === "__CHAT_CLOSED__");
  const displayMessages = messages.filter(m => m.content !== "__CHAT_CLOSED__"); 

  if (!show) return null;

  return (
    <Modal show={show} size="2xl" onClose={onClose}>
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-lg shadow-sm z-10">
        <h3 className="text-xl font-black text-navy flex items-center">
          <HiOutlineChatAlt2 className="mr-3 text-teal h-6 w-6" /> {targetName}
        </h3>
        
        <div className="flex items-center gap-1">
          {currentUser?.role === 'COMPANY' && (
            <>
              {!isClosed && (
                <button onClick={handleCloseChat} title="Clôturer la discussion" className="text-orange-400 hover:text-orange-600 hover:bg-orange-50 p-2 rounded-full transition-colors flex items-center">
                  <HiLockClosed className="h-6 w-6" />
                </button>
              )}
              
              <button onClick={handleDeleteChat} title="Supprimer l'historique" className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors flex items-center mr-2">
                <HiTrash className="h-6 w-6" />
              </button>
            </>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-coral font-black text-xl px-2">X</button>
        </div>
      </div>

      <div className="p-6 bg-gray-50 h-[60vh] overflow-y-auto flex flex-col gap-4 relative">
        {isLoading && displayMessages.length === 0 ? (
          <div className="flex justify-center items-center h-full"><Spinner size="xl" className="text-teal" /></div>
        ) : displayMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-70">
            <HiOutlineChatAlt2 className="h-16 w-16 mb-2" />
            <p>{isClosed ? "Cette conversation a été clôturée." : "Démarrez la conversation !"}</p>
          </div>
        ) : (
          displayMessages.map((msg, idx) => {
            const isMine = msg.sender === currentUser?.id;
            return (
              <div key={idx} className={`flex flex-col ${isMine ? "items-end" : "items-start"} mb-2`}>
                <span className="text-xs text-gray-400 font-bold mb-1 px-2">
                  {isMine ? "Vous" : targetName}
                </span>
                
                <div className={`max-w-[75%] px-5 py-3 rounded-2xl shadow-sm text-sm ${isMine ? "bg-teal text-white rounded-br-sm" : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"}`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span className={`text-[10px] block mt-1 ${isMine ? "text-teal-100 text-right" : "text-gray-400 text-left"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        
        {isClosed && (
          <div className="mt-4 bg-orange-100 border border-orange-200 text-orange-800 p-3 rounded-xl text-center text-sm font-bold flex items-center justify-center shadow-sm">
            <HiLockClosed className="mr-2 h-5 w-5" /> L'entreprise a clôturé cette conversation.
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100 rounded-b-lg">
        <form onSubmit={handleSend} className="flex gap-2">
          <TextInput 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            placeholder={isClosed ? "Discussion clôturée..." : "Écrivez votre message..."} 
            className="flex-1" 
            required 
            disabled={isClosed} 
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim() || isClosed} 
            className={`px-5 py-2 rounded-lg font-bold transition-colors flex items-center ${isClosed ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-coral text-white hover:bg-red-500"}`}
          >
            <HiPaperAirplane className="h-5 w-5 rotate-90" />
          </button>
        </form>
      </div>
    </Modal>
  );
}