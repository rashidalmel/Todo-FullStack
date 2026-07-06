# حاوية الواجهة الخلفية - نود جي إس / إكسبريس
FROM node:20-alpine

WORKDIR /app

# نسخ ملفات التبعيات أولاً للاستفادة من التخزين المؤقت (كاش) عند البناء
COPY package*.json ./
RUN npm install --omit=dev

# نسخ باقي ملفات المشروع
COPY . .

EXPOSE 5000

CMD ["node", "app.js"]
