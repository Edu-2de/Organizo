# Organizo

Organizo é um projeto web desenvolvido com **Django** (backend) e pensado para integração com frontend moderno (ex: Next.js). Ele oferece uma API robusta, autenticação, gerenciamento de usuários e tarefas, pronto para ser usado em ambientes de desenvolvimento ou produção.

## Tecnologias Principais

- [Django](https://www.djangoproject.com/)
- [Django REST Framework (DRF)](https://www.django-rest-framework.org/)
- [django-cors-headers](https://github.com/adamchainz/django-cors-headers)
- [django-environ](https://github.com/joke2k/django-environ)
- [PostgreSQL](https://www.postgresql.org/)
- [django-extensions](https://django-extensions.readthedocs.io/)
- [django-filter](https://django-filter.readthedocs.io/)
- [Django Sites framework](https://docs.djangoproject.com/en/5.2/ref/contrib/sites/)
- [django.contrib.humanize](https://docs.djangoproject.com/en/5.2/ref/contrib/humanize/)

## Pré-requisitos

- Python 3.10+
- PostgreSQL instalado e rodando
- (Opcional) Node.js e Next.js para frontend

## Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seuusuario/organizo.git
   cd organizo
   ```

2. **Crie e ative um ambiente virtual:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

3. **Instale as dependências:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure o arquivo `.env`:**
   Copie o exemplo abaixo e preencha com suas informações:
   ```env
   DB_NAME=organizo_db
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_HOST=localhost
   DB_PORT=5432
   SECRET_KEY=sua_chave_secreta
   DEBUG=True
   ```

5. **Execute as migrações:**
   ```bash
   python manage.py migrate
   ```

6. **Crie um superusuário:**
   ```bash
   python manage.py createsuperuser
   ```

7. **Inicie o servidor:**
   ```bash
   python manage.py runserver
   ```

## Principais Apps

- `tarefas` — Gerenciamento de tarefas
- `usuarios` — Gestão de usuários, autenticação e perfis

## Configuração de CORS

O projeto já vem pronto para integração com frontends modernos (ex: Next.js), permitindo requisições de `http://localhost:3000`.  
Para produção, ajuste o domínio em `settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "https://seu-dominio-frontend.com",
]
```

## Documentação da API

Se você incluir o [drf_yasg](https://drf-yasg.readthedocs.io/) (Swagger), a documentação estará disponível em:

```
/swagger/ ou /redoc/
```

## Scripts Utilitários

Você pode usar `django-extensions` para comandos extras, como:
```bash
python manage.py shell_plus
python manage.py show_urls
```

## Contribuindo

1. Fork este repositório
2. Crie sua branch (`git checkout -b feature/sua-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para sua branch (`git push origin feature/sua-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido por [Seu Nome ou Equipe]**