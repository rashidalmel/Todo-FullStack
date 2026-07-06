# حاوية الواجهة الأمامية - رياكت
# المرحلة الأولى: بناء المشروع
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# المرحلة الثانية: تقديم الملفات الجاهزة عبر خادم خفيف (nginx)
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
