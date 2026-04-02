import { useState, useEffect, useRef } from "react";
import { Modal, Spinner, TextInput } from "flowbite-react";
import { HiOutlineChatAlt2, HiPaperAirplane } from "react-icons/hi";
import { getConversation, sendMessage, getFreelanceProfileById, getCurrentUser } from "../services/api";

export default function MessageModal({ show, onClose, freelanceProfileId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [targetUserId, setTargetUserId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [freelanceName, setFreelanceName] = useState("Candidat");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (show && freelanceProfileId) {
      const initializeChat = async () => {
        setIsLoading(true);
        try {
          
          const me = await getCurrentUser();
          setCurrentUserId(me.id);
          
          const profile = await getFreelanceProfileById(freelanceProfileId);
          setTargetUserId(profile.freelance_user);
          setFreelanceName(profile.first_name || "Candidat");
          
          const chatHistory = await getConversation(profile.freelance_user);
          setMessages(chatHistory);
        } catch (error) {
          console.error("Erreur d'initialisation du chat", error);
        } finally {
          setIsLoading(false);
        }
      };
      initializeChat();
    }
  }, [show, freelanceProfileId]);

  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

 
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !targetUserId) return;

    try {
      
      const sentMsg = await sendMessage(targetUserId, newMessage);
      
      setMessages([...messages, sentMsg]);
      setNewMessage(""); 
    } catch (error) {
      console.error("Erreur d'envoi", error);
    }
  };

  if (!show) return null;

  return (
    <Modal show={show} size="2xl" onClose={onClose}>
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-lg shadow-sm z-10">
        <h3 className="text-xl font-black text-navy flex items-center">
          <HiOutlineChatAlt2 className="mr-3 text-teal h-6 w-6" /> 
          Conversation avec {freelanceName}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-coral font-black text-xl">X</button>
      </div>

      <div className="p-6 bg-gray-50 h-[60vh] overflow-y-auto flex flex-col gap-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full"><Spinner size="xl" className="text-teal" /></div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-70">
            <HiOutlineChatAlt2 className="h-16 w-16 mb-2" />
            <p>Démarrez la conversation !</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMine = msg.sender === currentUserId;
            return (
              <div key={idx} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div 
                  className={`max-w-[75%] px-5 py-3 rounded-2xl shadow-sm text-sm ${
                    isMine 
                      ? "bg-teal text-white rounded-br-sm" 
                      : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span className={`text-[10px] block mt-1 ${isMine ? "text-teal-100 text-right" : "text-gray-400 text-left"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100 rounded-b-lg">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <TextInput 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..." 
            className="flex-1"
            required
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="bg-coral text-white px-5 py-2 rounded-lg font-bold hover:bg-red-500 transition-colors disabled:opacity-50 flex items-center"
          >
            <HiPaperAirplane className="h-5 w-5 rotate-90" />
          </button>
        </form>
      </div>
    </Modal>
  );
}