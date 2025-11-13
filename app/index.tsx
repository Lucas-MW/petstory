import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function PageHome() {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Welcome to PetStory</Text>
      </View>

      <View style={styles.contentContainer}>
        <Link href={"/(dashboard-tabs)/dashboard"} style={styles.buttonLink}>
          <View style={styles.signInButton}>
            <Text style={styles.buttonText}>Sign In</Text>
          </View>
        </Link>

        <Text style={styles.signUpText}>
          Don't have an account?{" "}
          <Link href={"/dashboard"}> 
            <Text style={styles.signUpButton}>Sign Up</Text>
          </Link>
        </Text>
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
          container:{
            flex: 1,
            paddingHorizontal: '6%',
            paddingVertical: 60,
          },
          headerContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          },
          contentContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,              
          },
          signInButton:{
            width: '100%',
            maxWidth: 400,
            height: 60,
            backgroundColor: '#C47DE8FF',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          },
          buttonLink: {
            width: '90%',
            maxWidth: 400,
            alignItems: 'center',
          },
          buttonText:{
            fontFamily: 'Inter',
            fontSize: 18,
            fontWeight: '600',
            color: '#FFFFFFFF',
            textAlign: 'center',
          },
          signUpText:{
            fontFamily: 'Inter',
            fontSize: 16,
            lineHeight: 26,
            fontWeight: '500',
            color:"#C47DE8FF",
          }, 
          signUpButton:{
            fontWeight:'bold',
          },
          headerText:{
            fontFamily: 'Outfit',
            fontSize: 30,
            lineHeight: 36,
            fontWeight: '700',
            color: '#1A1A1AFF',
          },

        });