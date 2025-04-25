<template>
  <n-popover
    style="
      max-height: 41.875rem;
      padding: 0;
      border-radius: 30px;
      background-color: white;
      margin-bottom: 2rem;
    "
    trigger="manual"
    :placement="placement"
    :show="showChatbotModal"
    raw
    :show-arrow="false"
    class="chatbot-popover"
  >
    <template #trigger>
      <n-float-button
        style="background-color: var(--primary-20)"
        :right="20"
        :bottom="20"
        width="50"
        height="50"
        shape="circle"
        @click="showChatbotModal = !showChatbotModal"
      >
        <n-icon color="white" size="25">
          <ChatbubbleOutline />
        </n-icon>
      </n-float-button>
    </template>
    <div class="chatbot-container">
      <div class="chatbot-modal-header">
        <div class="header-content">
          <div class="header-semibold">Chatbot AI</div>
          <div class="paragraph-14-regular">Ask us about your work, we're here to help.</div>
        </div>
        <div class="close-button" @click="showChatbotModal = false">
          <n-icon size="20">
            <CloseOutline />
          </n-icon>
        </div>
      </div>
      <div class="chatbot-modal-body">
        <div class="chatbot-opening-message">
          <div v-if="!openingChat" class="welcome-section">
            <div class="welcome-icon">
              <n-icon color="white" size="25">
                <ChatbubbleOutline />
              </n-icon>
            </div>
            <div class="welcome-message">
              Hello Nice to see you here! By pressing the "Start Chat" button you agree to have your
              personal data processed as described in our Privacy Policy
            </div>
          </div>
          <div v-else class="chat-section">
            <div
              v-for="(msg, index) in messages"
              :key="index"
              :class="msg.type === 'user' ? 'bubble-user' : 'bubble-chatbot'"
            >
              <template v-if="msg.type === 'user'">
                <div class="bubble-content-container">
                  <div class="bubble-content">{{ msg.content }}</div>
                  <div class="paragraph-12-regular" style="text-align: left">{{ formatTime(msg.timestamp) }}</div>
                </div>
              </template>
              <template v-else>
                <div class="chatbot-avatar">
                  <n-icon color="white" size="20">
                    <ChatbubbleOutline />
                  </n-icon>
                </div>
                <div class="chatbot-message">
                  <div class="chatbot-name">Chatbot AI</div>
                  <div class="bubble-content markdown-content">
                    <vue-markdown :source="msg.content" />
                  </div>
                  <div class="paragraph-12-regular" style="text-align: right">{{ formatTime(msg.timestamp) }}</div>
                </div>
              </template>
            </div>
            <div v-if="isLoading" class="bubble-chatbot">
              <div class="chatbot-avatar">
                <n-icon color="white" size="20">
                  <ChatbubbleOutline />
                </n-icon>
              </div>
              <div class="chatbot-message">
                <div class="chatbot-name">Chatbot AI</div>
                <div class="bubble-content">Typing...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="chatbot-modal-footer">
        <div v-if="!openingChat" class="start-chat-section">
          <n-button
            style="width: 100%; background-color: var(--primary-20); color: white"
            round
            size="large"
            @click="openingChat = true"
          >
            Start Chat
          </n-button>
        </div>
        <div v-else class="chatbot-modal-footer-keyboard">
          <div class="keyboard-grid">
            <div class="keyboard-column">
              <n-button circle text class="keyboard-button">
                <n-image width="24px" height="auto" src="/smile-ic.svg" preview-disabled />
              </n-button>
            </div>
            <div class="keyboard-column">
              <div class="keyboard-input">
                <input
                  type="text"
                  v-model="message"
                  :placeholder="message"
                  @keyup.enter="sendMessage"
                />
              </div>
            </div>
            <div class="keyboard-column">
              <div class="keyboard-actions">
                <n-button
                  class="keyboard-button"
                  style="
                    background-color: var(--neutral-20);
                    color: var(--neutral-30);
                    transform: rotate(-45deg);
                  "
                  size="large"
                  circle
                  secondary
                >
                  <n-icon size="24">
                    <AttachmentSharp />
                  </n-icon>
                </n-button>
                <n-button
                  class="keyboard-button"
                  size="large"
                  style="background-color: var(--primary-20); color: white"
                  circle
                  secondary
                  :disabled="isLoading"
                  @click="sendMessage"
                >
                  <n-icon size="24">
                    <ArrowRight />
                  </n-icon>
                </n-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </n-popover>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { ChatbubbleOutline, CloseOutline } from '@vicons/ionicons5'
import { AttachmentSharp } from '@vicons/material'
import { ArrowRight } from '@vicons/tabler'
import { useGlobalStore } from '@/stores/global'
import VueMarkdown from 'vue-markdown-render'

const globalStore = useGlobalStore()
const collapsed = computed(() => globalStore.collapsed)

const placement = computed(() => {
  return window.innerWidth < 768 ? 'top' : 'left-start'
})

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const showChatbotModal = ref(false)
const openingChat = ref(false)
const message = ref('')
const messages = ref([])
const isLoading = ref(false)

// Function to format time
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

// Function to scroll to bottom
const scrollToBottom = () => {
  // Add a small delay to ensure the container is rendered
  setTimeout(() => {
    nextTick(() => {
      const chatContainer = document.querySelector('.chatbot-modal-body')
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight
      }
    })
  }, 100)
}

// Load chat history from localStorage when component is mounted
onMounted(() => {
  const savedMessages = localStorage.getItem('chatHistory')
  if (savedMessages) {
    messages.value = JSON.parse(savedMessages)
    openingChat.value = true
    // Scroll to bottom after loading chat history
    scrollToBottom()
  }
})

// Watch for modal visibility changes
watch(showChatbotModal, (newValue) => {
  if (newValue) {
    // Scroll to bottom when modal becomes visible
    scrollToBottom()
  }
})

// Save chat history to localStorage whenever messages change
watch(messages, (newMessages) => {
  localStorage.setItem('chatHistory', JSON.stringify(newMessages))
  // Scroll to bottom after messages change
  scrollToBottom()
}, { deep: true })

const sendMessage = async () => {
  if (!message.value.trim()) return

  // Add user message to chat
  const userMessage = {
    type: 'user',
    content: message.value,
    timestamp: new Date()
  }
  messages.value.push(userMessage)

  // Clear input
  const tempMessage = message.value
  message.value = ''

  try {
    isLoading.value = true

    // Send message to server
    const response = await useApi().post('/ai/generate', {
      message: tempMessage
    })

    // Add bot response to chat
    if (response.data) {
      const botMessage = {
        type: 'bot',
        content: response.data,
        timestamp: new Date()
      }
      messages.value.push(botMessage)
    } else {
      // Handle case where response doesn't have expected format
      const errorMessage = {
        type: 'bot',
        content: "Sorry, I couldn't process your message. Please try again.",
        timestamp: new Date()
      }
      messages.value.push(errorMessage)
    }
  } catch (error) {
    console.error('Error sending message:', error)
    // Add error message to chat
    const errorMessage = {
      type: 'bot',
      content: 'Sorry, I encountered an error. Please try again.',
      timestamp: new Date()
    }
    messages.value.push(errorMessage)
  } finally {
    isLoading.value = false
    // Scroll to bottom after message is added
    scrollToBottom()
  }
}

// Add initial welcome message when chat starts
watch(openingChat, (newValue) => {
  if (newValue && messages.value.length === 0) {
    messages.value = [
      {
        type: 'bot',
        content: 'Hello! How can I help you today?',
        timestamp: new Date()
      }
    ]
    // Scroll to bottom after welcome message
    scrollToBottom()
  }
})

// Watch for new messages and scroll to bottom
watch(
  messages,
  () => {
    scrollToBottom()
  },
  { deep: true }
)
</script>

<style scoped>
.chatbot-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 28.125rem;
  width: 100%;
}

.chatbot-modal-header {
  width: 100%;
  height: 100%;
  background-color: var(--primary-20);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1rem;
  color: white;
  border-radius: 30px 30px 0 0;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.close-button {
  cursor: pointer;
  border-radius: 500px;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
}

.chatbot-modal-body {
  width: 100%;
  height: 100%;
  background-color: white;
  padding: 1.5rem 1rem;
  overflow-y: auto;
  max-height: 30rem;
}

.chatbot-opening-message {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 2rem 0rem;
  gap: 1rem;
}

.welcome-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.welcome-icon {
  background-color: var(--primary-20);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3.5rem;
  height: 3.5rem;
}

.welcome-message {
  max-width: 65%;
  text-align: center;
}

.chat-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1rem;
}

.chatbot-modal-footer {
  border-top: 1px solid var(--neutral-20);
}

.start-chat-section {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem 1rem;
}

.chatbot-modal-footer-keyboard {
  width: 100%;
  padding: 0.5rem;
}

.keyboard-grid {
  display: grid;
  grid-template-columns: 40px 1fr 80px;
  gap: 0.5rem;
  align-items: center;
  border-radius: 8px;
  padding: 0.5rem;
}

.keyboard-column {
  display: flex;
  align-items: center;
}

.keyboard-input {
  flex: 1;
}

.keyboard-input input {
  width: 100%;
  border: none;
  background: transparent;
  padding: 0.5rem;
  outline: none;
  color: var(--text-color);
}

.keyboard-actions {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
  justify-content: space-between;
}

.keyboard-button {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.keyboard-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.bubble-user {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
  animation: fadeIn 0.3s ease-in-out;
}

.bubble-chatbot {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
  gap: 0.5rem;
  animation: fadeIn 0.3s ease-in-out;
}

.chatbot-avatar {
  background-color: var(--primary-20);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
}

.chatbot-message {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chatbot-name {
  color: var(--text-color);
  font-weight: 600;
}

.bubble-content {
  max-width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  word-wrap: break-word;
}

.bubble-user .bubble-content {
  background-color: var(--primary-20);
  color: white;
  border-top-right-radius: 0.25rem;
}

.bubble-chatbot .bubble-content {
  background-color: var(--neutral-20);
  color: var(--text-color);
  border-top-left-radius: 0.25rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes typing {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}

.bubble-chatbot .bubble-content.typing {
  animation: typing 1.5s infinite;
}

@media (max-width: 768px) {
  .chatbot-container {
    width: 80vw;
  }
  .close-button {
    width: 3rem;
    height: 2.7rem;
  }
}
</style>
