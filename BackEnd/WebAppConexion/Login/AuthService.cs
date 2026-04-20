using ServiceLoginGTH;
using System;
using System.Threading.Tasks;

namespace WebAppConexion.Login
{
    public class AuthService
    {
        public async Task<UserInfo> ValidarUsuarioAsync(string usuario, string clave)
        {
            Console.WriteLine("=== INICIO ValidarUsuarioAsync ===");
            Console.WriteLine($"Usuario recibido: {usuario}");
            Console.WriteLine($"Clave recibida: {clave}");

            // 🔍 PASO 1: Crear cliente SOAP para conectar a Active Directory
            var client = new AuthenticationSoapClient(
                AuthenticationSoapClient.EndpointConfiguration.AuthenticationSoap);

            try
            {
                Console.WriteLine("Cliente SOAP creado correctamente");
                Console.WriteLine("Llamando a AutenticateUserADAsync...");

                // 🔍 PASO 2: Llamar al servicio de Active Directory
                // Esto es como hacer una "llamada telefónica" al servidor de AD
                // 🔑 LA CLAVE: El método async retorna un objeto Response
                var response = await client.AutenticateUserADAsync(usuario, clave, "COMPUEQUIP");

                Console.WriteLine("Respuesta recibida del servicio SOAP");
                Console.WriteLine($"Response type: {response.GetType().Name}");

                // 🔍 PASO 3: Active Directory responde con los datos del usuario
                // Si las credenciales son correctas, retorna UserInfo
                // Si son incorrectas, retorna null
                await client.CloseAsync();
                Console.WriteLine("Cliente cerrado");

                // 🔍 OPCIÓN 1: Si la respuesta tiene Body.AutenticateUserADResult
                if (response?.Body?.AutenticateUserADResult != null)
                {
                    // 🔍 PASO 4: Extraer los datos del usuario de la respuesta
                    var userInfo = response.Body.AutenticateUserADResult;
                    Console.WriteLine($"✅ UserInfo obtenido vía Body.AutenticateUserADResult");
                    Console.WriteLine($"Usuario: {userInfo.Name}");
                    Console.WriteLine($"Email: {userInfo.Email}");
                    Console.WriteLine($"Login: {userInfo.Login}");
                    Console.WriteLine($"ActiveUser: {userInfo.ActiveUser}");
                    return userInfo;
                }

                // 🔍 OPCIÓN 2: Si la respuesta tiene AutenticateUserADResult directamente
                // Usa reflexión para obtener la propiedad
                var resultProperty = response.GetType().GetProperty("AutenticateUserADResult");
                if (resultProperty != null)
                {
                    var userInfo = resultProperty.GetValue(response) as UserInfo;
                    if (userInfo != null)
                    {
                        Console.WriteLine($"✅ UserInfo obtenido vía reflexión");
                        Console.WriteLine($"Usuario: {userInfo.Name}");
                        Console.WriteLine($"Email: {userInfo.Email}");
                        return userInfo;
                    }
                }

                // 🔍 OPCIÓN 3: Investigar la estructura completa del response
                Console.WriteLine("⚠️ Investigando estructura del response...");
                var properties = response.GetType().GetProperties();
                foreach (var prop in properties)
                {
                    Console.WriteLine($"Propiedad encontrada: {prop.Name} - Tipo: {prop.PropertyType.Name}");
                    var value = prop.GetValue(response);
                    if (value != null)
                    {
                        Console.WriteLine($"  Valor: {value}");

                        // Si encontramos una propiedad que es UserInfo, retornarla
                        if (value is UserInfo userInfo)
                        {
                            Console.WriteLine($"✅ UserInfo encontrado en propiedad: {prop.Name}");
                            return userInfo;
                        }

                        // Si encontramos Body, buscar dentro de Body
                        if (prop.Name == "Body")
                        {
                            var bodyProperties = value.GetType().GetProperties();
                            foreach (var bodyProp in bodyProperties)
                            {
                                Console.WriteLine($"  Body.{bodyProp.Name} - Tipo: {bodyProp.PropertyType.Name}");
                                var bodyValue = bodyProp.GetValue(value);
                                if (bodyValue is UserInfo bodyUserInfo)
                                {
                                    Console.WriteLine($"✅ UserInfo encontrado en Body.{bodyProp.Name}");
                                    return bodyUserInfo;
                                }
                            }
                        }
                    }
                }

                Console.WriteLine("❌ ERROR: No se pudo extraer UserInfo de la respuesta");
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine("=== ERROR EN ValidarUsuarioAsync ===");
                Console.WriteLine($"Tipo de error: {ex.GetType().Name}");
                Console.WriteLine($"Mensaje: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");

                try
                {
                    await client.CloseAsync();
                }
                catch { }

                throw;
            }
        }
    }
}