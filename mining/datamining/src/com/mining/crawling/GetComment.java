package com.mining.crawling;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import org.jsoup.Jsoup;
import org.jsoup.HttpStatusException;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Repository;
import java.util.Collections;
import com.mining.analysis.AnalysisComment;

@Repository
public class GetComment {
	public void GetComent() {

	}

	public static void main(String[] args) {
		// CrawlingComment("136873");
	}
	//데이터 담아서 보내는 작업
	public Map<String, Object> CrawlingComment(String cd) {
		String url = "https://movie.naver.com/movie/bi/mi/pointWriteFormList.nhn?code=" + cd
				+ "&type=after&isActualPointWriteExecute=false&isMileageSubscriptionAlready=false&isMileageSubscriptionReject=false&page=";

		AnalysisComment ac = new AnalysisComment();
		Map<String,Object> tranResult = ac.getAlc(GetCrawling(url));
		
		List<Map<String, Object>> result = (List<Map<String, Object>>) tranResult.get("result");
		List<Map<String, Object>> listCount = (List<Map<String, Object>>) tranResult.get("listCount");
		tranResult.put("getCommentResult", result);
		tranResult.put("listCount",listCount);
		//System.out.println("gct 에 crawling result임" + result);
		return tranResult;
	}
	
	
	//명사,동사에 대한 단어 빈도수 세는 작업
	public List<Map<String, Object>> CountWords(List<Map<String, Object>> result) {
		//Map<String, Object> paramMap = new HashMap<String, Object>();
		
		ArrayList<String> ary = new ArrayList<String>();
		List<Map<String, Object>> countResult = new ArrayList<>();
		for(Map<String, Object>row : result){

			for (String key : row.keySet()) {
				if(key =="star" || key == "id"){
					continue;
				}
				else{
					String[] getValue = row.get(key).toString().split(",");
					for (int k = 0; k < getValue.length; k++) {
						getValue[k] = getValue[k].replace("[", "");
						getValue[k] = getValue[k].replace("]", "");
						getValue[k] = getValue[k].replace("{", "");
						getValue[k] = getValue[k].replace("}", "");
						if(getValue[k].equals("좋")||getValue[k].equals("싫")||getValue[k].equals("하")
								||getValue[k].equals("있")||getValue[k].equals("잇")||getValue[k].equals("때")
								||getValue[k].equals("살")||getValue[k].equals("없")||getValue[k].equals("아ㄴ")
								||getValue[k].equals("영화")||getValue[k].equals("느낌")||getValue[k].equals("생각")
								||getValue[k].equals("보")||getValue[k].equals("이")||getValue[k].equals("는")
								||getValue[k].equals("가")||getValue[k].equals("도")||getValue[k].equals("은")
								||getValue[k].equals("는")||getValue[k].equals("울")||getValue[k].equals("때"))
						{
							//System.out.println(getValue[k] + " 이놈이 걸러졌어 ");
							continue;
						}
						ary.add(getValue[k]);
					}
				}
			}break;
	}
		Collections.sort(ary);//정렬
//		int count = 1;
//		for (int j = 0; j < ary.size(); j++) {
//			if (j + 1 < ary.size()) {
//				if (ary.get(j).equals(ary.get(j + 1))) { // i번째와 i+1번쨰와 비교하여 같으면 + 아니면 맵객체에 추가
//
//					count++;
//				} else {
//					Map<String, Object> checkCompare = new HashMap<>();
//					if (count == 1) {
//						continue;
//					}
//					checkCompare.put("name", ary.get(j));
//					checkCompare.put("val2", count);
//					countResult.add(checkCompare);
//					//System.out.println("빈도수:" + ary.get(j) + "//    횟수: " + count);
//					count = 1;
//				}
//			}
//		}
		//워드에 대한 count를 만든다. 	
		   Map<String,String> mapValue = new HashMap<String,String>() ;
		   for( int x=0 ; ary.size() > x ; x++){
			   String strCnt  = mapValue.get(ary.get(x)) ;
			   if( strCnt == null ) strCnt = "0" ;
			   int intCnt  =  Integer.parseInt( strCnt) ;
			   intCnt = intCnt  + 1  ; 
			   mapValue.put(ary.get(x), intCnt + "" );
		   }
	 
		   //리턴 형식으로 변경한다. 
			
		   for( String strKeys  : mapValue.keySet()){
			   Map<String, Object> checkCompare = new HashMap<>();
				checkCompare.put("name", strKeys);
				checkCompare.put("val2", mapValue.get(strKeys));
				countResult.add(checkCompare);
		   } 
		//System.out.println("gct 에 countResult 임 " + countResult);
		return countResult;
	}
	
	
	//댓글 가져오는 작업 
	public List<Map<String, Object>> GetCrawling(String url) {
		// Jsoup를 이용해서 http://www.cgv.co.kr/movies/ 크롤링
		List<Map<String, Object>> getComment = new ArrayList<>();
		
		for (int pageCount = 1; pageCount <= 10; pageCount++) { //pageCount = 긁어올 페이지 수
			Document doc = null; // Document에는 페이지의 전체 소스가 저장된다
			try {
				doc = Jsoup.connect(url + "" + pageCount).get();
			} catch (NoSuchElementException s) {
				s.printStackTrace();
			}
			catch (HttpStatusException h) {
				System.out.println("해당주소는 없는주소 입니다.404");
			} catch (IOException e) {
				System.out.println("뭔오류인지몰라 ");
				e.printStackTrace();
			}
			// select를 이용하여 원하는 태그를 선택한다. select는 원하는 값을 가져오기 위한 중요한 기능이다.
			Elements element = doc.select("div.score_result"); // 댓글 긁어오기
			Elements elePage = doc.select("body input[name=page]"); // 페이지수 긁어오기
			// Iterator을 사용하여 하나씩 값 가져오기
			Iterator<Element> ieComment = element.select("div.score_reple").iterator(); // 댓글전체
			Iterator<Element> ieId = element.select("div.score_reple em span").iterator(); // 아이디
			Iterator<Element> ieStar = element.select("div.star_score").iterator();
			//댓글이 없을경우 계속 같은데이터를 가져와서 이를 방지하기 위한 작업
			int getPageCount = Integer.parseInt(elePage.attr("value")); 
			if (getPageCount < pageCount) { // for문보다 검색한페이지수가 작을때 댓글이없으므로 멈춤
				System.out.println("댓글이끝났습니다.");
				break;
			}
			
			while (ieComment.hasNext()) { // element에서 값이 있을때동안 계속 값을 끄내와서 와일문돌림
				Map<String, Object> getData = new HashMap<>();
				String txtComment = ieComment.next().toString(); // 댓글전체
				boolean isContain = txtComment.contains("data-src"); //
				if (isContain == true) { // fold된 댓글들 읽기
					int firstIndex = txtComment.indexOf("data-src");
					int lastIndex = txtComment.indexOf("onclick=\"unfold");
					String txtId = ieId.next().text();
					String star = ieStar.next().text();
					String foldComment = txtComment.substring(firstIndex + 10, lastIndex - 2);
					//System.out.println(txtId + "\t " + foldComment);
					//System.out.println(foldComment);
					getData.put("id",txtId);
					getData.put("comment",foldComment);
					getData.put("star", star);
					getComment.add(getData);
					//getComment.put(txtId, foldComment);
				} else { // unfold된 댓글들 읽기
					int firstIndex = txtComment.indexOf("_filtered_ment_");
					int lastIndex = txtComment.indexOf("</span> </p> ");
					String star = ieStar.next().text();
					String txtId = ieId.next().text();
					String noFold = txtComment.substring(firstIndex + 19, lastIndex);
					boolean ckBlock = noFold.contains("tyle=");
					if (ckBlock == true) {
						noFold = noFold.substring(22);
					}
					getData.put("id",txtId);
					getData.put("comment",noFold);
					getData.put("star", star);
					getComment.add(getData);
					//System.out.println(getData);
					//getComment.put(txtId, noFold);
					//System.out.println(txtId + "\t " + noFold);
					//System.out.println(noFold);
				}
			}
		} // for문끝
		System.out.println("크롤링끝");
		return getComment;
	}
	
	//공란 확인 작업
	public static String nullToBlank(Object comment) {
        if (comment == null) return "";
        return String.valueOf(comment).trim();
    }
}