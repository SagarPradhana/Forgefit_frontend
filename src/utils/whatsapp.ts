interface UserData {
  name?: string;
  mobile?: string;
  phone?: string;
  latest_subscription_details?: {
    subscription_name?: string;
    end_date?: number;
    start_date?: number;
  };
}

const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

export const generateWhatsAppReminderMessage = (user: UserData): string => {
  const userName = user.name || "Member";
  const subscription = user.latest_subscription_details;
  const endDate = subscription?.end_date;
  const subscriptionName = subscription?.subscription_name || "Gym Membership";
  
  let message = "";
  
  if (!endDate) {
    message = 
`*Greetings ${userName}!*

We hope this message finds you well!

*Membership Status:*
It seems you don't have an active subscription plan. Your current plan has expired or is not available.

*Next Step:*
Please visit us at the gym or contact our team to renew your membership and continue your fitness journey with us!

For any queries, feel free to reply to this message.`;
  } else {
    const now = Math.floor(Date.now() / 1000);
    const daysRemaining = Math.ceil((endDate - now) / (60 * 60 * 24));
    
    if (daysRemaining <= 0) {
      message = 
`*Greetings ${userName}!*

We hope this message finds you well!

*Membership Status:*
Your ${subscriptionName} has expired on ${formatDate(endDate)}. Please renew your membership to continue your fitness journey with us!

*Next Step:*
Please visit us at the gym or contact our team to renew your membership and continue your fitness journey with us!

For any queries, feel free to reply to this message.`;
    } else if (daysRemaining <= 30) {
      message = 
`*Greetings ${userName}!*

We hope this message finds you well!

*Membership Status:*
Your ${subscriptionName} will expire on ${formatDate(endDate)} (${daysRemaining} days remaining). Please renew your membership or take a new plan to continue your fitness journey with us!

*Next Step:*
Please visit us at the gym or contact our team to renew your membership and continue your fitness journey with us!

For any queries, feel free to reply to this message.`;
    } else {
      message = 
`*Greetings ${userName}!*

We hope this message finds you well!

*Membership Status:*
Your ${subscriptionName} is active until ${formatDate(endDate)} (${daysRemaining} days remaining).

*Next Step:*
Keep pushing towards your fitness goals! For any queries, feel free to reply to this message.`;
    }
  }
  
  return encodeURIComponent(message);
};

export const openWhatsAppChat = (user: UserData): void => {
  const mobile = user.mobile || user.phone;
  
  if (!mobile) {
    alert("User doesn't have a mobile number registered.");
    return;
  }
  
  let cleanNumber = mobile.replace(/\D/g, "");
  
  if (cleanNumber.startsWith("91") && cleanNumber.length > 10) {
    cleanNumber = cleanNumber.substring(2);
  } else if (!cleanNumber.startsWith("91") && cleanNumber.length === 10) {
    cleanNumber = "91" + cleanNumber;
  }
  
  const message = generateWhatsAppReminderMessage(user);
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;
  
  window.open(whatsappUrl, "_blank");
};