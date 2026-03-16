frontend remaining requirements 
Section 1 :

A second tab for the table must be included exclusively for listing all the user who applied for the seller. Using the similar table design, change the CTA to Approve and Decline. Approving a user will change their account type to Seller. When declining, a pop-up modal must be shown for the admin to input a reason for declining. When approving, a popup modal must be shown too, for assigning of merchant-id.

Now, upon signing in, a regular user can choose a service they want to avail. Availing a service will be paid using PayPal. However, the setup for this project will feature a multi-merchant approach using your project as a platform only.

How does this works? Your platform will be a platform only, meaning all payments must be sent directly to the PayPal of the Seller not the platform. However, using your merchant account in PayPal, we should be able to see all the transaction happening inside your project.

Section 2:

Upon visiting your merchant paypal account, here are the following information we should be able to see:

-Order Description (Service Name not the actual Service Description)

-Price

Section 3:

You also need a seller's dashboard (/screens/SellerDashboard.jsx) where approved sellers can add new services (inputting name, description, price, duration, image) and manage existing ones.

You will also need a user's profile page (/screens/UserProfile.jsx) which will show the User Information, and a table below for listing all their orders.

Section 4:
 (My gemini key I will paste later, it is a Gemini API key)

Lastly, an AI Chatbot that only answers questions and inquiries based on the type of Project you are creating (Carpentry and Woodwork)

Section 5:

Note: Obviously, you need redux /reducers, /actions, /constants and store.js

Note: You need to implement proper validation to the frontend too. Making sure that a user must be signin first before being able to access the pages, otherwise redirect them to the Login Page.

BACKEND REQUIREMENTS:

 

Your Backend must have the following apps


users app: Handles authentication, JWT tokens, the custom user model (roles: Admin, Seller, User), and profile fetching.

Create a CustomUserModel extending AbstractUser or AbstractBaseUser using the following fields

-email

-username

-phone_number

-first_name

-last_name

-location

-gender

-role

-merchant_id

 

For serializers you need UserSerializer RegisterSerializer and MyTokenObtainPairSerializer

For views you need MyTokenObtainPairView, RegisterView, UserProfileView, AdminUserListView

For urls you need login/, register/, profile/ and admin/users/

 

applications app: Handles the seller application lifecycle (Apply, Approve, Decline, assign merchant ID).

Create a SellerApplication model this will hold the status of the application of a user using the following fields:

STATUS_CHOICES

user

status

decline_reason

created_at

For serializer, you need SellerApplicationSerializer

For views, you need ApproveApplicationView, DeclineApplicationView, SubmitApplicationView and ListApplicationView

For urls, you need apply/, list/, pk/approve/ and pk/decline/

 

services app: Handles CRUD operations for services (including the local image uploads) and public listings.

Create a Service model with the following fields:

seller

service_name

description

price

duration_of_service

sample_image

For serializers, you need ServiceSerializer

For views, you need ServiceListView, SellerServiceManageView, ServiceDetailView, SellerServiceDetailView

For urls, you need list/, pk/, manage/ and manage/pk/

 

orders app: Handles logging the successful PayPal transactions and tying a buyer to a specific service.

Create an Order model with the following fields:

buyer

service

paypal_transaction_id

price_paid

date_purchased

 

For serializers, you need OrderSerializer

For views, you need CreateOrderView, UserOrderHistoryView

For urls, you need create/ and history/

 

chat app: Handles the AI chatbot API communication.

You need AIChatbotView

For urls, you need ask/

 

Your base urls must hold the following route

/api/v1/users/

/api/v1/applications/

/api/v1/services/

/api/v1/orders/

/api/v1/chat