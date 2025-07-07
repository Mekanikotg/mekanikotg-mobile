import ICONS from "./ICONS";
import IMAGES from "./IMAGES";

export default DATA = {
  GEOCODER_API_KEY: "AIzaSyCQbokBEwRvRnmvp_9YCXGH7CJfAZMj2uw",
  ROOM: { SEARCHING: "searching..." },
  PESO: "₱",
  PH_MAP_REGION: {
    latitude: 12.8797,
    longitude: 121.7740,
    latitudeDelta: 7.0,
    longitudeDelta: 7.0
  },
  MECHANIC_PROBLEMS: [
    "Car not starting",
    "Engine failure",
    "Battery problem",
    "Flat tire",
    "Other"
  ],
  CUSTOMERHOMESCREEN: {
    SERVICES: [
      {
        label: "Mechanic",
        icons: ICONS.MECHANIC,
        navigateTo: "mechanic-booking",
      },
      {
        label: "Towing",
        icons: ICONS.TOWING,
        navigateTo: "customer-towing",
      },
    ],
    MENU: [
      {
        label: "Profile",
        icons: ICONS.PROFILE,
        navigateTo: "customer-profile",
      },
      {
        label: "History",
        icons: ICONS.HISTORY,
        navigateTo: "customer-history",
      },
      {
        label: "FaQ's",
        icons: ICONS.FAQS,
        navigateTo: "customer-faqs",
      },
      {
        label: "Log Out",
        icons: ICONS.LOGOUT,
      },
    ],
    FAQS: [
      {
        title: "What is mekanikOTG?",
        description: `MekanikOTG is a mobile application, wherein the user can book an automotive mechanic/technician to repair car or motorcycle issues. This mobile application can include fixing engines, transmissions, brakes, electrical systems, and more as an emergency wherever you are located.`,
      },
      {
        title: " Is mekanikOTG available in my city or country?",
        description: `Yes, MekanikOTG is available in the Philippines. However, it is currently focused in NCR area. We will update this soon.`,
      },
      {
        title: "How do I book a mechanic with mekanikOTG?",
        description: `MekanikOTG contains simple and friendly-user features. After creating an account, you can click on the service/s you need. On the next stage you have to provide your location or allow MekanikOTG to access your location.`,
      },
      {
        title: "Are the automotive mechanics/technicians experienced?",
        description: `es, our automotive mechanics/locksmiths went through the right process and verification.`,
      },
      {
        title: "How safe is mekanikOTG?",
        description: `Our locksmiths/mechanics are verified.`,
      },
      {
        title: "How is the pricing for mekanikOTG determined?",
        description: `The price depends on the service and car/ motorcycle issues. Therefore, if possible, please specify the damage. Otherwise, the pricing may depend after it has been repaired.`,
      },
    ],
  },
  ADMINHOMESCREEN: {
    MANAGEMENT: [
      {
        label: "Users",
        icons: ICONS.USERS,
        navigateTo: "admin-users",
      },
      {
        label: "Verification",
        icons: ICONS.VERIFICATION,
        navigateTo: "admin-verification",
      },
      {
        label: "Mechanics",
        icons: ICONS.MECHANIC_TRACK,
        navigateTo: "admin-mechanics",
      },
      {
        label: "Tools",
        icons: ICONS.MECHANIC,
        navigateTo: "admin-tools",
      },
      {
        label: "Towing",
        icons: ICONS.TOWING,
        navigateTo: "admin-towing",
      },
      {
        label: "News",
        icons: ICONS.NEWS,
        navigateTo: "admin-news",
      },
    ],
    MENU: [
      {
        label: "Profile",
        icons: ICONS.PROFILE,
        navigateTo: "customer-profile",
      },
      {
        label: "Log Out",
        icons: ICONS.LOGOUT,
      },
    ],
  },
  PROFILE: {
    VALID_IDS:
      [
        "PHILID",
        "PHILHEALTH",
        "SSS",
      ]
  },
  EMAILS:
  {
    PASSWORD: {
      SUBJECT: "Password Reset Request",
      BODY: ({ name, code }) => {
        return (
          `Dear ${name},\nWe received a request to reset the password associated with your account. To proceed with the password reset, please follow the steps below:\nYour Code: ${code}\n1. Enter the code that has been sent!\n2. Enter your new password and confirm password!\n\nIf you did not initiate this request or have any concerns, please contact our support team immediately with this email.\n\nThank you for choosing our system.\n\nBest regards,\nMekanikOTG Customer Support Team`
        )
      }
    },
    RATING: {
      SUBJECT: "Service Rating",
      BODY: ({ name, starRating, comment }) => {
        return (
          `Hi ${name},\nThis email is to inform you about the service you provided.\n\nStar Rating: ${starRating == 0 ? "No Star" : starRating}\nComment: ${comment} \n\nBest regards,\nMekanikOTG Customer Support Team`
        )
      }
    },
    PROFILE: {
      SUBJECT: "Profile Verification Status",
      BODY: ({ name, status }) => {
        let message = ""
        switch (status) {
          case 3:
            message = "We appreciate your time verifying your account. However your profile status is being rejected due to lack of information you provided."
            break
          case 1:
            message = "Your profile status is now verified. You may now use our services by logging in to mekanikOTG Application."
            break
        }
        return (
          `Dear ${name},\n\n${message}\n\nIf you did not initiate this request or have any concerns, please contact our support team immediately with this email.\n\nThank you for choosing our system.\n\nBest regards,\nMekanikOTG Customer Support Team`
        )
      }
    },
    JOB: {
      SUBJECT: "Job Application Status",
      BODY: ({ name, status }) => {
        let message = ""
        switch (status) {
          case 3:
            message = "Thank you for taking your time for applying to us. However your application status is being rejected due to lack of information you provided."
            break
          case 1:
            message = "Congratulations you are now qualified to work with us. "
            break
        }
        return (
          `Dear ${name},\n\n${message}\n\nIf you did not initiate this request or have any concerns, please contact our support team immediately with this email.\n\nThank you for choosing our system.\n\nBest regards,\nMekanikOTG Customer Support Team`
        )
      }
    },
  },
  TERMS_AND_CONDITIONS:
    [
      "Services: MEKANIKOTG connects you with qualified mechanics and locksmiths to assist with technical issues related to your car or motorcycle.",
      "Booking: You can book services through the app by providing necessary details such as location, vehicle type, and issue description.",
      "Service Fee: Fees for services are clearly outlined before booking. Payment can be seen through the app, and its method is cash upon fixing through Mechanic/Locksmith.",
      "Liability: While we strive for excellent service, MEKANIKOTG is not liable for any damages or losses resulting from service provided by mechanics or locksmiths.",
      "User Conduct: Users must provide accurate information, treat service providers respectfully, and use the app in accordance with applicable laws.",
      "Feedback: Your feedback helps us improve our services. Please share your experience after each service.",
      "Privacy: We respect your privacy. Please refer to our Privacy Policy for details on how we collect, use, and protect your information."
    ]
};
