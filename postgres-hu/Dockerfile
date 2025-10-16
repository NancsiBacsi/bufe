# magyaros PostgreSQL 17 build Debian (glibc) alapon
FROM postgres:17-bullseye

# magyar locale telepítése
RUN apt-get update \
    && apt-get install -y locales \
    && sed -i '/hu_HU.UTF-8/s/^# //g' /etc/locale.gen \
    && locale-gen \
    && update-locale LANG=hu_HU.UTF-8 \
    && rm -rf /var/lib/apt/lists/*

# környezeti változók
ENV LANG=hu_HU.UTF-8 \
    LANGUAGE=hu_HU:hu \
    LC_ALL=hu_HU.UTF-8

# saját pg_hba.conf bemásolása a biztonságos helyre
# (nem a data dir-be, hogy ne zavarja az init folyamatot)
COPY pg_hba.conf /etc/postgresql/pg_hba.conf
RUN chmod 644 /etc/postgresql/pg_hba.conf && chown postgres:postgres /etc/postgresql/pg_hba.conf

# PostgreSQL indítása a saját hba_file beállítással
CMD ["postgres", "-c", "hba_file=/etc/postgresql/pg_hba.conf", "-c", "listen_addresses=*"]
