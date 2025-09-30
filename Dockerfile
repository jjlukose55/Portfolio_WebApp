# 1️⃣ Start from the official, tiny nginx image
FROM nginx:alpine

# 2️⃣ Copy the entire project into nginx’s default document root.
COPY . /usr/share/nginx/html

# 3️⃣ Expose port 80 so the container can be accessed externally.
EXPOSE 80

# 4️⃣ Run nginx in the foreground – this keeps the container alive.
CMD ["nginx", "-g", "daemon off;"]