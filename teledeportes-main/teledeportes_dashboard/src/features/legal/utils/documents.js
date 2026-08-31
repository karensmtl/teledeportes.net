import { ORGANIZATION as ORG } from '../../../core/constants/organization';

// Contenido de las páginas legales, como datos: un layout único los renderiza.
//
// AVISO: borrador redactado sobre el marco colombiano (Ley 1581 de 2012 y
// Decreto 1377 de 2013 para datos personales; Ley 23 de 1982 y Ley 1915 de 2018
// para derechos de autor) y sobre los requisitos de Google Play (identificación
// del desarrollador, datos recogidos por la app, canal de eliminación de
// cuenta). NO sustituye revisión de un abogado, y hay campos sin resolver en
// core/constants/organization.js. Revisar antes de someter la ficha.
//
// La URL /privacidad ya está declarada en la ficha de Play Store: no cambiar la
// ruta sin actualizarla allá, o la ficha apuntará a una página inexistente.
//
// Estructura: { heading, paragraphs?, list? } por sección.

const contactBlock = `${ORG.legalName} · NIT ${ORG.taxId} · ${ORG.address}, ${ORG.city}, ${ORG.country} · ${ORG.privacyEmail}`;

export const PRIVACY = {
    slug: 'privacidad',
    title: 'Política de privacidad y tratamiento de datos personales',
    lead: `Esta política describe cómo ${ORG.brand} recolecta, usa, almacena y protege los datos personales de quienes usan el sitio ${ORG.site} y la aplicación ${ORG.appName}, en cumplimiento de la Ley 1581 de 2012, el Decreto 1377 de 2013 y demás normas concordantes de la República de Colombia.`,
    sections: [
        {
            heading: '1. Responsable del tratamiento',
            paragraphs: [
                'El responsable del tratamiento de los datos personales recolectados a través del sitio web y de la aplicación es:',
                contactBlock,
                `Cualquier consulta, reclamo o solicitud relacionada con datos personales debe dirigirse a ${ORG.privacyEmail}.`,
            ],
        },
        {
            heading: '2. Alcance',
            paragraphs: [
                `Esta política aplica al sitio web ${ORG.site} y a la aplicación ${ORG.appName} distribuida a través de Google Play, incluidas sus versiones para televisor.`,
            ],
        },
        {
            heading: '3. Datos que recolectamos',
            paragraphs: ['Recolectamos únicamente los datos necesarios para operar el servicio:'],
            list: [
                'Datos de navegación y uso: dirección IP, tipo de navegador o dispositivo, versión del sistema operativo, pantallas visitadas, duración de la sesión y contenido reproducido. Se usan de forma agregada para entender el uso del servicio.',
                'Datos de cuenta: cuando existe una cuenta, nombre, correo electrónico y credenciales almacenadas de forma cifrada. Ver el contenido público no exige registro.',
                'Datos de contacto: los que la persona nos entrega voluntariamente al escribirnos.',
                'Datos técnicos de reproducción: calidad del video, cortes y errores, para diagnosticar la calidad de la transmisión.',
                'Diagnóstico de fallos: cuando la aplicación se cierra de forma inesperada, puede enviarse un informe técnico anónimo con el estado del dispositivo en ese momento.',
            ],
        },
        {
            heading: '4. Datos que NO recolectamos',
            list: [
                'No accedemos a la agenda de contactos, a las fotos ni a los archivos del dispositivo.',
                'No recolectamos ubicación precisa (GPS).',
                'No usamos los datos para publicidad dirigida ni construimos perfiles comerciales.',
                'No vendemos, arrendamos ni cedemos datos personales a terceros con fines comerciales.',
            ],
        },
        {
            heading: '5. Finalidades del tratamiento',
            list: [
                'Permitir el acceso al contenido en vivo y bajo demanda.',
                'Mantener la seguridad del servicio y prevenir usos fraudulentos o abusivos.',
                'Medir audiencia y desempeño técnico de las transmisiones de forma estadística.',
                'Atender solicitudes, consultas y reclamos.',
                'Cumplir obligaciones legales y requerimientos de autoridad competente.',
            ],
        },
        {
            heading: '6. Autorización',
            paragraphs: [
                'Al usar el sitio o la aplicación, la persona titular autoriza el tratamiento de sus datos personales en los términos de esta política. Cuando la ley exija autorización previa, expresa e informada, se solicitará de forma separada y podrá revocarse en cualquier momento.',
            ],
        },
        {
            heading: '7. Cookies y almacenamiento local',
            paragraphs: [
                'Usamos almacenamiento local del navegador o del dispositivo para conservar la sesión y las preferencias de reproducción. Estas tecnologías no se emplean para publicidad dirigida.',
                'La persona puede bloquear o borrar estos datos desde la configuración de su navegador o desinstalando la aplicación; hacerlo puede impedir el acceso a las funciones que requieren sesión.',
            ],
        },
        {
            heading: '8. Terceros y transferencias',
            paragraphs: [
                'La infraestructura de video se opera sobre servidores propios: el video en vivo se entrega directamente desde el servidor de medios al reproductor, sin intermediarios comerciales.',
                'La distribución de la aplicación se realiza a través de Google Play, que aplica sus propias políticas de privacidad sobre la descarga e instalación, ajenas a nuestro control.',
                'Cuando una página incluya contenido incrustado de terceros, ese tercero podrá recolectar datos según sus propias políticas.',
                'Si se realizan transferencias internacionales de datos, se harán conforme a los artículos 26 y 27 de la Ley 1581 de 2012.',
            ],
        },
        {
            heading: '9. Derechos de la persona titular',
            paragraphs: ['Conforme al artículo 8 de la Ley 1581 de 2012, toda persona titular tiene derecho a:'],
            list: [
                'Conocer, actualizar y rectificar sus datos personales.',
                'Solicitar prueba de la autorización otorgada.',
                'Ser informada sobre el uso que se ha dado a sus datos.',
                'Presentar quejas ante la Superintendencia de Industria y Comercio por infracciones a la ley.',
                'Revocar la autorización y solicitar la supresión de sus datos, cuando no exista un deber legal o contractual de conservarlos.',
                'Acceder de forma gratuita a sus datos personales.',
            ],
        },
        {
            heading: '10. Eliminación de cuenta y de datos',
            paragraphs: [
                `Para solicitar la eliminación de una cuenta y de los datos personales asociados, escribe a ${ORG.privacyEmail} desde el correo registrado, indicando nombre completo y documento de identidad.`,
                'La solicitud se atiende en un plazo máximo de quince (15) días hábiles. Se eliminarán los datos de la cuenta y el historial de uso asociado, salvo aquella información que debamos conservar por obligación legal, caso en el cual se informará el fundamento y el término de conservación.',
            ],
        },
        {
            heading: '11. Cómo ejercer estos derechos',
            paragraphs: [
                `Las solicitudes se reciben en ${ORG.privacyEmail}, indicando nombre completo, documento de identidad, el derecho que se ejerce y los datos de contacto para la respuesta.`,
                'Las consultas se atienden en un plazo máximo de diez (10) días hábiles, prorrogable por cinco (5) días hábiles más. Los reclamos se atienden en un plazo máximo de quince (15) días hábiles, prorrogable por ocho (8) días hábiles más, informando siempre los motivos de la prórroga.',
            ],
        },
        {
            heading: '12. Seguridad de la información',
            paragraphs: [
                'Aplicamos medidas técnicas y administrativas razonables para proteger los datos frente a acceso no autorizado, pérdida o alteración: cifrado del tráfico en tránsito, control de acceso por permisos y almacenamiento de credenciales mediante funciones de derivación seguras.',
                'Ningún sistema es completamente infalible; ante un incidente de seguridad que comprometa datos personales, se informará a las personas afectadas y a la autoridad competente conforme a la ley.',
            ],
        },
        {
            heading: '13. Conservación',
            paragraphs: [
                'Los datos se conservan mientras exista una finalidad que lo justifique o mientras lo exija una obligación legal. Cumplido ese término, se suprimen o se anonimizan.',
            ],
        },
        {
            heading: '14. Menores de edad',
            paragraphs: [
                'El servicio es de acceso general y no está dirigido a la recolección de datos de menores de edad. Cuando ello ocurra, el tratamiento respetará el interés superior de niñas, niños y adolescentes y sus derechos fundamentales, conforme al artículo 7 de la Ley 1581 de 2012.',
            ],
        },
        {
            heading: '15. Cambios a esta política',
            paragraphs: [
                'Esta política puede actualizarse. La fecha de última revisión aparece al inicio del documento; los cambios sustanciales se anunciarán en el sitio y en la aplicación.',
            ],
        },
    ],
};

export const TERMS = {
    slug: 'terminos',
    title: 'Términos y condiciones de uso',
    lead: `Estos términos regulan el acceso y uso del sitio ${ORG.site} y de la aplicación ${ORG.appName}. Al usar cualquiera de los dos, la persona usuaria acepta quedar vinculada por ellos.`,
    sections: [
        {
            heading: '1. Identificación',
            paragraphs: [
                `El servicio es operado por ${ORG.legalName}, NIT ${ORG.taxId}, con domicilio en ${ORG.address}, ${ORG.city}, ${ORG.country}. Canal de contacto: ${ORG.email}.`,
            ],
        },
        {
            heading: '2. Objeto',
            paragraphs: [
                `${ORG.brand} difunde contenido audiovisual e informativo de carácter deportivo: transmisiones en vivo, video bajo demanda, noticias y material de archivo.`,
                'El acceso al contenido público es gratuito y no requiere registro.',
            ],
        },
        {
            heading: '3. Uso permitido',
            paragraphs: ['La persona usuaria se obliga a usar el servicio conforme a la ley, la buena fe y estos términos. En particular, se abstendrá de:'],
            list: [
                'Retransmitir, redistribuir, grabar o poner a disposición del público el contenido sin autorización escrita previa.',
                'Eludir, desactivar o interferir medidas técnicas de protección o control de acceso.',
                'Extraer contenido de forma masiva o automatizada sin autorización.',
                'Introducir código malicioso o realizar acciones que degraden la disponibilidad del servicio.',
                'Suplantar la identidad de terceros o usar credenciales ajenas.',
                'Modificar, descompilar o realizar ingeniería inversa sobre la aplicación, salvo en la medida permitida por la ley.',
            ],
        },
        {
            heading: '4. Cuentas',
            paragraphs: [
                'El acceso al panel administrativo está restringido a personas autorizadas. Quien tenga credenciales es responsable de su custodia y de toda actividad realizada con ellas, y debe notificar de inmediato cualquier uso no autorizado.',
                `La eliminación de una cuenta puede solicitarse conforme al procedimiento descrito en la Política de privacidad.`,
            ],
        },
        {
            heading: '5. Propiedad intelectual',
            paragraphs: [
                'El contenido del servicio —textos, imágenes, video, audio, marcas, logotipos y diseño— está protegido por la Ley 23 de 1982, la Ley 1915 de 2018 y demás normas de derecho de autor y propiedad industrial aplicables en Colombia, así como por los tratados internacionales vigentes.',
                'Los derechos sobre las transmisiones deportivas y sobre los eventos difundidos pertenecen a sus titulares. Su difusión en este servicio no transfiere ningún derecho a la persona usuaria.',
                'Se permite el uso personal y privado del contenido, así como la cita conforme al artículo 31 de la Ley 23 de 1982, indicando la fuente.',
            ],
        },
        {
            heading: '6. Disponibilidad del servicio',
            paragraphs: [
                'Las transmisiones en vivo dependen de infraestructura de red y de terceros proveedores. El servicio se presta sobre la base de disponibilidad razonable, sin garantía de continuidad ininterrumpida ni de ausencia de errores.',
                'Podremos suspender el servicio de forma temporal por mantenimiento, actualizaciones o causas de fuerza mayor, procurando avisar cuando sea posible.',
                'La programación y la disponibilidad de los eventos pueden cambiar sin previo aviso por decisión de los titulares de los derechos.',
            ],
        },
        {
            heading: '7. Aplicación móvil y de televisión',
            paragraphs: [
                `La aplicación ${ORG.appName} se distribuye a través de Google Play. Su descarga e instalación se rigen adicionalmente por los términos de esa plataforma.`,
                'Publicamos actualizaciones periódicas; algunas pueden ser necesarias para seguir usando el servicio. La aplicación requiere conexión a internet y su desempeño depende del dispositivo y de la calidad de la red.',
            ],
        },
        {
            heading: '8. Contenido de terceros y enlaces',
            paragraphs: [
                'El servicio puede incluir enlaces o contenido incrustado de terceros. No controlamos ese contenido ni respondemos por él; su uso se rige por los términos y políticas de cada tercero.',
            ],
        },
        {
            heading: '9. Responsabilidad',
            paragraphs: [
                'El contenido informativo se publica de buena fe y con propósito divulgativo. No respondemos por decisiones que la persona usuaria tome con base en él.',
                'En ningún caso responderemos por daños indirectos, lucro cesante o pérdida de datos derivados del uso o la imposibilidad de uso del servicio, salvo en los casos en que la ley no admita esa limitación.',
            ],
        },
        {
            heading: '10. Protección de datos',
            paragraphs: [
                'El tratamiento de datos personales se rige por la Política de privacidad, que forma parte integral de estos términos.',
            ],
        },
        {
            heading: '11. Modificaciones',
            paragraphs: [
                'Podemos modificar estos términos en cualquier momento. La versión vigente es la publicada en esta página, con su fecha de última revisión. El uso continuado del servicio tras una modificación implica su aceptación.',
            ],
        },
        {
            heading: '12. Ley aplicable y jurisdicción',
            paragraphs: [
                'Estos términos se rigen por la ley colombiana. Cualquier controversia se someterá a los jueces y tribunales competentes de la República de Colombia.',
            ],
        },
        {
            heading: '13. Contacto',
            paragraphs: [
                `Para cualquier asunto relacionado con estos términos: ${ORG.email}.`,
            ],
        },
    ],
};
