# Flex Money Assignment

# /sign-up 
 Users can able to register with Name, EmailId, Age, Shift that he desired to join<br>
  EmailId - Need to be unique<br>
  Age- 18-65<br>
  If he chooses shift that means he is joining and paying 500 to join Yoga classes for a month starting from today<br>
  
# /sign-in
  For register users only- once we provide our mail id <br>
   -It fetches the subscription <br>
   -Amount we paid so far<br>
   -Expiration Date if he got subscribed<br>
   -If he doesn't have subscription It will show to renewal<br>
   
# backend-api
 # /backendapi/users GET
   -we can get all users data<br>
   
 # backendapi/users POST
   -User sign up endpoint<br>
   -req params we get the data and we post it in backend server<br>
   -once again we check the constraits<br>
   
 # /backendapi/users/:EmailId GET
   -By req.params we find the row by using the EmailId <br>
   -As the EmailId is the primary key for the Object<br>
   
  # /backendapi/users/:EmailId DELETE
   -By req.params we find the row by using the EmailId <br>
   -And we can remove the document if needed<br>
   -But in the front-end I didn't added this feature<br>
  
